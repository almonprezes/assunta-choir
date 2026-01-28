const express = require('express');
const { body, validationResult } = require('express-validator');
const { db } = require('../supabase-client');
const { authenticateToken } = require('./auth');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const concerts = await db.getAllConcerts();
        res.json(concerts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch concerts' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const concert = await db.getConcertById(id);
        if (!concert) {
            return res.status(404).json({ error: 'Concert not found' });
        }
        res.json(concert);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch concert' });
    }
});

router.post('/', authenticateToken, [
    body('title').notEmpty().withMessage('Title is required'),
    body('date').isISO8601().withMessage('Valid date is required'),
    body('location').notEmpty().withMessage('Location is required')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, date, location, isPublic } = req.body;

    try {
        const concertData = {
            title,
            description,
            date,
            location,
            is_public: isPublic || true
        };
        const newConcert = await db.createConcert(concertData);
        res.json(newConcert);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create concert' });
    }
});

router.put('/:id', authenticateToken, [
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('date').optional().isISO8601().withMessage('Valid date is required'),
    body('location').optional().notEmpty().withMessage('Location cannot be empty')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { title, description, date, location, isPublic } = req.body;

    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (date !== undefined) updates.date = date;
    if (location !== undefined) updates.location = location;
    if (isPublic !== undefined) updates.is_public = isPublic;

    try {
        const updatedConcert = await db.updateConcert(id, updates);
        res.json(updatedConcert);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update concert' });
    }
});

router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        await db.deleteConcert(id);
        res.json({ message: 'Concert deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete concert' });
    }
});

module.exports = router;
