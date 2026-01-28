const express = require('express');
const { body, validationResult } = require('express-validator');
const { db } = require('../supabase-client');
const { authenticateToken } = require('./auth');

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
    try {
        const rehearsals = await db.getAllRehearsals();
        res.json(rehearsals);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch rehearsals' });
    }
});

router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const rehearsal = await db.getRehearsalById(id);
        if (!rehearsal) {
            return res.status(404).json({ error: 'Rehearsal not found' });
        }
        res.json(rehearsal);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch rehearsal' });
    }
});

router.post('/', authenticateToken, [
    body('title').notEmpty().withMessage('Title is required'),
    body('date').isISO8601().withMessage('Valid date is required'),
    body('time').notEmpty().withMessage('Time is required'),
    body('location').notEmpty().withMessage('Location is required')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, date, time, location, duration } = req.body;

    try {
        const rehearsalData = {
            title,
            description,
            date,
            time,
            location,
            duration
        };
        const newRehearsal = await db.createRehearsal(rehearsalData);
        res.json(newRehearsal);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create rehearsal' });
    }
});

router.put('/:id', authenticateToken, [
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('date').optional().isISO8601().withMessage('Valid date is required'),
    body('time').optional().notEmpty().withMessage('Time cannot be empty'),
    body('location').optional().notEmpty().withMessage('Location cannot be empty')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { title, description, date, time, location, duration } = req.body;

    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (date !== undefined) updates.date = date;
    if (time !== undefined) updates.time = time;
    if (location !== undefined) updates.location = location;
    if (duration !== undefined) updates.duration = duration;

    try {
        const updatedRehearsal = await db.updateRehearsal(id, updates);
        res.json(updatedRehearsal);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update rehearsal' });
    }
});

router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        await db.deleteRehearsal(id);
        res.json({ message: 'Rehearsal deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete rehearsal' });
    }
});

module.exports = router;
