const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../database');
const { authenticateToken } = require('./auth');

const router = express.Router();

router.get('/', authenticateToken, (req, res) => {
    const query = req.user.role === 'admin'
        ? 'SELECT id, username, email, first_name, last_name, voice_part, role, created_at FROM users ORDER BY last_name, first_name'
        : 'SELECT id, username, first_name, last_name, voice_part FROM users WHERE role != "admin" ORDER BY last_name, first_name';

    db.all(query, [], (err, members) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch members' });
        }
        res.json(members);
    });
});

router.get('/profile', authenticateToken, (req, res) => {
    db.get(
        'SELECT id, username, email, first_name, last_name, voice_part, role, created_at FROM users WHERE id = ?',
        [req.user.userId],
        (err, user) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to fetch profile' });
            }
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json(user);
        }
    );
});

router.put('/profile', authenticateToken, [
    body('firstName').optional().notEmpty().withMessage('First name cannot be empty'),
    body('lastName').optional().notEmpty().withMessage('Last name cannot be empty'),
    body('voicePart').optional().isString(),
    body('email').optional().isEmail().withMessage('Valid email required')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, voicePart, email } = req.body;

    const updates = [];
    const values = [];

    if (firstName !== undefined) { updates.push('first_name = ?'); values.push(firstName); }
    if (lastName !== undefined) { updates.push('last_name = ?'); values.push(lastName); }
    if (voicePart !== undefined) { updates.push('voice_part = ?'); values.push(voicePart); }
    if (email !== undefined) { updates.push('email = ?'); values.push(email); }

    if (updates.length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(req.user.userId);

    db.run(
        `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
        values,
        function (err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(400).json({ error: 'Email already exists' });
                }
                return res.status(500).json({ error: 'Failed to update profile' });
            }

            db.get(
                'SELECT id, username, email, first_name, last_name, voice_part, role, created_at FROM users WHERE id = ?',
                [req.user.userId],
                (err, user) => {
                    if (err) {
                        return res.status(500).json({ error: 'Failed to retrieve updated profile' });
                    }
                    res.json(user);
                }
            );
        }
    );
});

router.put('/:id/role', authenticateToken, [
    body('role').isIn(['member', 'admin']).withMessage('Role must be member or admin')
], (req, res) => {
    if (req.user.role !== 'admin' && req.user.username !== 'norbert') {
        return res.status(403).json({ error: 'Admin access required' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { role } = req.body;

    db.run(
        'UPDATE users SET role = ? WHERE id = ?',
        [role, id],
        function (err) {
            if (err) {
                return res.status(500).json({ error: 'Failed to update user role' });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: 'User not found' });
            }

            db.get(
                'SELECT id, username, email, first_name, last_name, voice_part, role, created_at FROM users WHERE id = ?',
                [id],
                (err, user) => {
                    if (err) {
                        return res.status(500).json({ error: 'Failed to retrieve updated user' });
                    }
                    res.json(user);
                }
            );
        }
    );
});

router.delete('/:id', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin' && req.user.username !== 'norbert') {
        return res.status(403).json({ error: 'Admin access required' });
    }

    const { id } = req.params;

    if (parseInt(id) === req.user.userId) {
        return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    db.run('DELETE FROM users WHERE id = ?', [id], function (err) {
        if (err) {
            return res.status(500).json({ error: 'Failed to delete user' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    });
});

module.exports = router;
