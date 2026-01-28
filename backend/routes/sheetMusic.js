const express = require('express');
const { body, validationResult } = require('express-validator');
const { db } = require('../supabase-client');
const { authenticateToken } = require('./auth');

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
    try {
        const sheetMusic = await db.getAllSheetMusic();
        res.json(sheetMusic);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch sheet music' });
    }
});

router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const sheet = await db.getSheetMusicById(id);
        if (!sheet) {
            return res.status(404).json({ error: 'Sheet music not found' });
        }
        res.json(sheet);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch sheet music' });
    }
});

router.post('/', authenticateToken, [
    body('title').notEmpty().withMessage('Title is required'),
    body('filePath').notEmpty().withMessage('File path is required')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { title, composer, description, filePath, fileSize, voicePart } = req.body;

    try {
        const sheetData = {
            title,
            composer,
            description,
            file_path: filePath,
            file_size: fileSize,
            voice_part: voicePart,
            uploaded_by: req.user.userId
        };
        const newSheet = await db.createSheetMusic(sheetData);
        res.json(newSheet);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create sheet music' });
    }
});

router.put('/:id', authenticateToken, [
    body('title').optional().notEmpty().withMessage('Title cannot be empty')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { title, composer, description, voicePart } = req.body;

    const updates = {};
    if (title !== undefined) updates.title = title;
    if (composer !== undefined) updates.composer = composer;
    if (description !== undefined) updates.description = description;
    if (voicePart !== undefined) updates.voice_part = voicePart;

    try {
        const updatedSheet = await db.updateSheetMusic(id, updates);
        res.json(updatedSheet);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update sheet music' });
    }
});

router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        await db.deleteSheetMusic(id);
        res.json({ message: 'Sheet music deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete sheet music' });
    }
});

module.exports = router;
