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
        const uploadDir = path.join(__dirname, '..', 'uploads', 'recordings');
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
    const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/m4a', 'audio/ogg'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only audio files are allowed.'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 50 * 1024 * 1024 }
});

router.get('/', authenticateToken, (req, res) => {
    const query = req.user.role === 'admin'
        ? 'SELECT r.*, u.username as uploaded_by_username FROM recordings r LEFT JOIN users u ON r.uploaded_by = u.id ORDER BY r.upload_date DESC'
        : 'SELECT r.*, u.username as uploaded_by_username FROM recordings r LEFT JOIN users u ON r.uploaded_by = u.id WHERE r.is_public = 1 OR r.uploaded_by = ? ORDER BY r.upload_date DESC';

    const params = req.user.role === 'admin' ? [] : [req.user.userId];

    db.all(query, params, (err, recordings) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch recordings' });
        }
        res.json(recordings);
    });
});

router.get('/:id', authenticateToken, (req, res) => {
    const { id } = req.params;

    let query = 'SELECT r.*, u.username as uploaded_by_username FROM recordings r LEFT JOIN users u ON r.uploaded_by = u.id WHERE r.id = ?';
    let params = [id];

    if (req.user.role !== 'admin') {
        query += ' AND (r.is_public = 1 OR r.uploaded_by = ?)';
        params.push(req.user.userId);
    }

    db.get(query, params, (err, recording) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch recording' });
        }
        if (!recording) {
            return res.status(404).json({ error: 'Recording not found' });
        }
        res.json(recording);
    });
});

router.post('/', authenticateToken, upload.single('audioFile'), [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').optional().isString(),
    body('isPublic').optional().isBoolean()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        return res.status(400).json({ errors: errors.array() });
    }

    if (!req.file) {
        return res.status(400).json({ error: 'Audio file is required' });
    }

    const { title, description, isPublic } = req.body;
    const filePath = req.file.path;
    const fileName = req.file.filename; // Tylko nazwa pliku
    const fileSize = req.file.size;

    db.run(
        'INSERT INTO recordings (title, description, file_path, file_size, uploaded_by, is_public) VALUES (?, ?, ?, ?, ?, ?)',
        [title, description, fileName, fileSize, req.user.userId, isPublic || false],
        function (err) {
            if (err) {
                fs.unlinkSync(filePath);
                return res.status(500).json({ error: 'Failed to save recording' });
            }

            db.get('SELECT r.*, u.username as uploaded_by_username FROM recordings r LEFT JOIN users u ON r.uploaded_by = u.id WHERE r.id = ?', [this.lastID], (err, recording) => {
                if (err) {
                    return res.status(500).json({ error: 'Failed to retrieve saved recording' });
                }
                res.status(201).json(recording);
            });
        }
    );
});

router.put('/:id', authenticateToken, [
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('description').optional().isString(),
    body('isPublic').optional().isBoolean()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { title, description, isPublic } = req.body;

    let query = 'SELECT * FROM recordings WHERE id = ?';
    let params = [id];

    if (req.user.role !== 'admin') {
        query += ' AND uploaded_by = ?';
        params.push(req.user.userId);
    }

    db.get(query, params, (err, recording) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch recording' });
        }
        if (!recording) {
            return res.status(404).json({ error: 'Recording not found or access denied' });
        }

        const updates = [];
        const values = [];

        if (title !== undefined) { updates.push('title = ?'); values.push(title); }
        if (description !== undefined) { updates.push('description = ?'); values.push(description); }
        if (isPublic !== undefined) { updates.push('is_public = ?'); values.push(isPublic); }

        if (updates.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }

        values.push(id);

        db.run(
            `UPDATE recordings SET ${updates.join(', ')} WHERE id = ?`,
            values,
            function (err) {
                if (err) {
                    return res.status(500).json({ error: 'Failed to update recording' });
                }

                db.get('SELECT r.*, u.username as uploaded_by_username FROM recordings r LEFT JOIN users u ON r.uploaded_by = u.id WHERE r.id = ?', [id], (err, updatedRecording) => {
                    if (err) {
                        return res.status(500).json({ error: 'Failed to retrieve updated recording' });
                    }
                    res.json(updatedRecording);
                });
            }
        );
    });
});

router.delete('/:id', authenticateToken, (req, res) => {
    const { id } = req.params;

    let query = 'SELECT * FROM recordings WHERE id = ?';
    let params = [id];

    if (req.user.role !== 'admin') {
        query += ' AND uploaded_by = ?';
        params.push(req.user.userId);
    }

    db.get(query, params, (err, recording) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch recording' });
        }
        if (!recording) {
            return res.status(404).json({ error: 'Recording not found or access denied' });
        }

        db.run('DELETE FROM recordings WHERE id = ?', [id], function (err) {
            if (err) {
                return res.status(500).json({ error: 'Failed to delete recording' });
            }

            if (recording.file_path && fs.existsSync(recording.file_path)) {
                fs.unlinkSync(recording.file_path);
            }

            res.json({ message: 'Recording deleted successfully' });
        });
    });
});

const handleDownload = (recording) => {
    const link = document.createElement('a');
    link.href = `/uploads/recordings/${recording.file_path}`;
    link.download = `${recording.title.replace(/[^a-zA-Z0-9]/g, '_')}.mp3`;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

module.exports = router;
