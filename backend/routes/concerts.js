const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../database');
const { authenticateToken } = require('./auth');

const router = express.Router();

router.get('/', (req, res) => {
    const query = req.query.include_private === 'true'
        ? 'SELECT * FROM concerts ORDER BY date ASC'
        : 'SELECT * FROM concerts WHERE is_public = 1 ORDER BY date ASC';

    db.all(query, [], (err, concerts) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch concerts' });
        }
        res.json(concerts);
    });
});

router.get('/:id', (req, res) => {
    const { id } = req.params;

    db.get('SELECT * FROM concerts WHERE id = ?', [id], (err, concert) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch concert' });
        }
        if (!concert) {
            return res.status(404).json({ error: 'Concert not found' });
        }
        if (!concert.is_public && req.query.include_private !== 'true') {
            return res.status(403).json({ error: 'Access denied' });
        }
        res.json(concert);
    });
});

router.post('/', authenticateToken, [
    body('title').notEmpty().withMessage('Title is required'),
    body('date').isISO8601().withMessage('Valid date is required'),
    body('location').notEmpty().withMessage('Location is required')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, date, location, isPublic } = req.body;

    db.run(
        'INSERT INTO concerts (title, description, date, location, is_public) VALUES (?, ?, ?, ?, ?)',
        [title, description, date, location, isPublic || true],
        function (err) {
            if (err) {
                return res.status(500).json({ error: 'Failed to create concert' });
            }

            db.get('SELECT * FROM concerts WHERE id = ?', [this.lastID], (err, concert) => {
                if (err) {
                    return res.status(500).json({ error: 'Failed to retrieve created concert' });
                }
                res.status(201).json(concert);
            });
        }
    );
});

router.put('/:id', authenticateToken, [
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('date').optional().isISO8601().withMessage('Valid date is required'),
    body('location').optional().notEmpty().withMessage('Location cannot be empty')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { title, description, date, location, isPublic } = req.body;

    const updates = [];
    const values = [];

    if (title !== undefined) { updates.push('title = ?'); values.push(title); }
    if (description !== undefined) { updates.push('description = ?'); values.push(description); }
    if (date !== undefined) { updates.push('date = ?'); values.push(date); }
    if (location !== undefined) { updates.push('location = ?'); values.push(location); }
    if (isPublic !== undefined) { updates.push('is_public = ?'); values.push(isPublic); }

    if (updates.length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    db.run(
        `UPDATE concerts SET ${updates.join(', ')} WHERE id = ?`,
        values,
        function (err) {
            if (err) {
                return res.status(500).json({ error: 'Failed to update concert' });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Concert not found' });
            }

            db.get('SELECT * FROM concerts WHERE id = ?', [id], (err, concert) => {
                if (err) {
                    return res.status(500).json({ error: 'Failed to retrieve updated concert' });
                }
                res.json(concert);
            });
        }
    );
});

router.delete('/:id', authenticateToken, (req, res) => {
    const { id } = req.params;

    db.run('DELETE FROM concerts WHERE id = ?', [id], function (err) {
        if (err) {
            return res.status(500).json({ error: 'Failed to delete concert' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Concert not found' });
        }
        res.json({ message: 'Concert deleted successfully' });
    });
});

module.exports = router;
