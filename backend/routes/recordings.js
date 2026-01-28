const express = require('express');
const { body, validationResult } = require('express-validator');
const { db } = require('../supabase-client');
const { authenticateToken } = require('./auth');

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
    try {
        const recordings = await db.getAllRecordings();
        res.json(recordings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch recordings' });
    }
});

router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const recording = await db.getRecordingById(id);
        if (!recording) {
            return res.status(404).json({ error: 'Recording not found' });
        }
        res.json(recording);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch recording' });
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

    const { title, description, filePath, fileSize, duration, isPublic } = req.body;

    try {
        const recordingData = {
            title,
            description,
            file_path: filePath,
            file_size: fileSize,
            duration,
            is_public: isPublic || false,
            uploaded_by: req.user.userId
        };
        const newRecording = await db.createRecording(recordingData);
        res.json(newRecording);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create recording' });
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
    const { title, description, isPublic } = req.body;

    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (isPublic !== undefined) updates.is_public = isPublic;

    try {
        const updatedRecording = await db.updateRecording(id, updates);
        res.json(updatedRecording);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update recording' });
    }
});

router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        await db.deleteRecording(id);
        res.json({ message: 'Recording deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete recording' });
    }
});

module.exports = router;
