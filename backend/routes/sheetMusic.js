const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { body, validationResult } = require('express-validator');
const db = require('../database');
const { authenticateToken } = require('./auth');

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '..', 'uploads', 'sheet-music');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PDF and image files are allowed.'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 20 * 1024 * 1024 }
});

router.get('/', authenticateToken, (req, res) => {
    const query = req.user.role === 'admin'
        ? 'SELECT sm.*, u.username as uploaded_by_username FROM sheet_music sm LEFT JOIN users u ON sm.uploaded_by = u.id ORDER BY sm.upload_date DESC'
        : 'SELECT sm.*, u.username as uploaded_by_username FROM sheet_music sm LEFT JOIN users u ON sm.uploaded_by = u.id WHERE sm.voice_part = ? OR sm.uploaded_by = ? ORDER BY sm.upload_date DESC';

    const params = req.user.role === 'admin' ? [] : [req.user.voicePart || '', req.user.userId];

    db.all(query, params, (err, sheetMusic) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch sheet music' });
        }
        res.json(sheetMusic);
    });
});

router.get('/:id', authenticateToken, (req, res) => {
    const { id } = req.params;

    let query = 'SELECT sm.*, u.username as uploaded_by_username FROM sheet_music sm LEFT JOIN users u ON sm.uploaded_by = u.id WHERE sm.id = ?';
    let params = [id];

    if (req.user.role !== 'admin') {
        query += ' AND (sm.voice_part = ? OR sm.uploaded_by = ?)';
        params.push(req.user.voicePart || '', req.user.userId);
    }

    db.get(query, params, (err, sheetMusic) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch sheet music' });
        }
        if (!sheetMusic) {
            return res.status(404).json({ error: 'Sheet music not found' });
        }
        res.json(sheetMusic);
    });
});

router.post('/', authenticateToken, upload.single('sheetFile'), [
    body('title').notEmpty().withMessage('Title is required'),
    body('composer').optional().isString(),
    body('description').optional().isString(),
    body('voicePart').optional().isString()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        return res.status(400).json({ errors: errors.array() });
    }

    if (!req.file) {
        return res.status(400).json({ error: 'Sheet music file is required' });
    }

    const { title, composer, description, voicePart } = req.body;
    const filePath = req.file.path;
    const fileSize = req.file.size;

    // Convert absolute path to relative path for frontend
    const relativePath = path.relative(path.join(__dirname, '..'), filePath).replace(/\\/g, '/');

    db.run(
        'INSERT INTO sheet_music (title, composer, description, file_path, file_size, uploaded_by, voice_part) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [title, composer, description, relativePath, fileSize, req.user.userId, voicePart],
        function (err) {
            if (err) {
                fs.unlinkSync(filePath);
                return res.status(500).json({ error: 'Failed to save sheet music' });
            }

            db.get('SELECT sm.*, u.username as uploaded_by_username FROM sheet_music sm LEFT JOIN users u ON sm.uploaded_by = u.id WHERE sm.id = ?', [this.lastID], (err, sheetMusic) => {
                if (err) {
                    return res.status(500).json({ error: 'Failed to retrieve saved sheet music' });
                }
                res.status(201).json(sheetMusic);
            });
        }
    );
});

router.put('/:id', authenticateToken, [
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('composer').optional().isString(),
    body('description').optional().isString(),
    body('voicePart').optional().isString()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { title, composer, description, voicePart } = req.body;

    let query = 'SELECT * FROM sheet_music WHERE id = ?';
    let params = [id];

    if (req.user.role !== 'admin') {
        query += ' AND uploaded_by = ?';
        params.push(req.user.userId);
    }

    db.get(query, params, (err, sheetMusic) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch sheet music' });
        }
        if (!sheetMusic) {
            return res.status(404).json({ error: 'Sheet music not found or access denied' });
        }

        const updates = [];
        const values = [];

        if (title !== undefined) { updates.push('title = ?'); values.push(title); }
        if (composer !== undefined) { updates.push('composer = ?'); values.push(composer); }
        if (description !== undefined) { updates.push('description = ?'); values.push(description); }
        if (voicePart !== undefined) { updates.push('voice_part = ?'); values.push(voicePart); }

        if (updates.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }

        values.push(id);

        db.run(
            `UPDATE sheet_music SET ${updates.join(', ')} WHERE id = ?`,
            values,
            function (err) {
                if (err) {
                    return res.status(500).json({ error: 'Failed to update sheet music' });
                }

                db.get('SELECT sm.*, u.username as uploaded_by_username FROM sheet_music sm LEFT JOIN users u ON sm.uploaded_by = u.id WHERE sm.id = ?', [id], (err, updatedSheetMusic) => {
                    if (err) {
                        return res.status(500).json({ error: 'Failed to retrieve updated sheet music' });
                    }
                    res.json(updatedSheetMusic);
                });
            }
        );
    });
});

router.delete('/:id', authenticateToken, (req, res) => {
    const { id } = req.params;

    let query = 'SELECT * FROM sheet_music WHERE id = ?';
    let params = [id];

    if (req.user.role !== 'admin') {
        query += ' AND uploaded_by = ?';
        params.push(req.user.userId);
    }

    db.get(query, params, (err, sheetMusic) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch sheet music' });
        }
        if (!sheetMusic) {
            return res.status(404).json({ error: 'Sheet music not found or access denied' });
        }

        db.run('DELETE FROM sheet_music WHERE id = ?', [id], function (err) {
            if (err) {
                return res.status(500).json({ error: 'Failed to delete sheet music' });
            }

            if (sheetMusic.file_path && fs.existsSync(sheetMusic.file_path)) {
                fs.unlinkSync(sheetMusic.file_path);
            }

            res.json({ message: 'Sheet music deleted successfully' });
        });
    });
});

module.exports = router;
