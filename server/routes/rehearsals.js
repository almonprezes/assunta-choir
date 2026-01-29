const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../database');
const { authenticateToken } = require('./auth');

const router = express.Router();

router.get('/', authenticateToken, (req, res) => {
    db.all('SELECT * FROM rehearsals ORDER BY date ASC', [], (err, rehearsals) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch rehearsals' });
        }
        res.json(rehearsals);
    });
});

router.get('/:id', authenticateToken, (req, res) => {
    const { id } = req.params;

    db.get('SELECT * FROM rehearsals WHERE id = ?', [id], (err, rehearsal) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch rehearsal' });
        }
        if (!rehearsal) {
            return res.status(404).json({ error: 'Rehearsal not found' });
        }
        res.json(rehearsal);
    });
});

router.post('/', authenticateToken, [
    body('title').notEmpty().withMessage('Title is required'),
    body('date').isISO8601().withMessage('Valid date is required'),
    body('location').notEmpty().withMessage('Location is required'),
    body('duration').isInt({ min: 1 }).withMessage('Duration must be a positive integer')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, date, location, duration } = req.body;

    db.run(
        'INSERT INTO rehearsals (title, description, date, location, duration) VALUES (?, ?, ?, ?, ?)',
        [title, description, date, location, duration],
        function (err) {
            if (err) {
                return res.status(500).json({ error: 'Failed to create rehearsal' });
            }

            db.get('SELECT * FROM rehearsals WHERE id = ?', [this.lastID], (err, rehearsal) => {
                if (err) {
                    return res.status(500).json({ error: 'Failed to retrieve created rehearsal' });
                }
                res.status(201).json(rehearsal);
            });
        }
    );
});

router.put('/:id', authenticateToken, [
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('date').optional().isISO8601().withMessage('Valid date is required'),
    body('location').optional().notEmpty().withMessage('Location cannot be empty'),
    body('duration').optional().isInt({ min: 1 }).withMessage('Duration must be a positive integer')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { title, description, date, location, duration } = req.body;

    const updates = [];
    const values = [];

    if (title !== undefined) { updates.push('title = ?'); values.push(title); }
    if (description !== undefined) { updates.push('description = ?'); values.push(description); }
    if (date !== undefined) { updates.push('date = ?'); values.push(date); }
    if (location !== undefined) { updates.push('location = ?'); values.push(location); }
    if (duration !== undefined) { updates.push('duration = ?'); values.push(duration); }

    if (updates.length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    db.run(
        `UPDATE rehearsals SET ${updates.join(', ')} WHERE id = ?`,
        values,
        function (err) {
            if (err) {
                return res.status(500).json({ error: 'Failed to update rehearsal' });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Rehearsal not found' });
            }

            db.get('SELECT * FROM rehearsals WHERE id = ?', [id], (err, rehearsal) => {
                if (err) {
                    return res.status(500).json({ error: 'Failed to retrieve updated rehearsal' });
                }
                res.json(rehearsal);
            });
        }
    );
});

router.delete('/:id', authenticateToken, (req, res) => {
    const { id } = req.params;

    db.run('DELETE FROM rehearsals WHERE id = ?', [id], function (err) {
        if (err) {
            return res.status(500).json({ error: 'Failed to delete rehearsal' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Rehearsal not found' });
        }
        res.json({ message: 'Rehearsal deleted successfully' });
    });
});

module.exports = router;
