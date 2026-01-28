const express = require('express');
const { body, validationResult } = require('express-validator');
const { db } = require('../supabase-client');
const { authenticateToken } = require('./auth');

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
    try {
        const users = req.user.role === 'admin'
            ? await db.getAllUsers()
            : await db.getAllMembers();

        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch members' });
    }
});

// Route dla recordings (dla kompatybilności)
router.get('/recordings', authenticateToken, async (req, res) => {
    try {
        const recordings = await db.getAllRecordings();
        res.json(recordings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch recordings' });
    }
});

// Pobierz oczekujących członków
router.get('/pending', authenticateToken, async (req, res) => {
    if (req.user.role !== 'admin' && req.user.username !== 'norbert') {
        return res.status(403).json({ error: 'Admin access required' });
    }

    try {
        const pendingUsers = await db.getPendingMembers();
        res.json(pendingUsers);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch pending users' });
    }
});

// Zatwierdź członka
router.put('/:id/approve', authenticateToken, async (req, res) => {
    if (req.user.role !== 'admin' && req.user.username !== 'norbert') {
        return res.status(403).json({ error: 'Admin access required' });
    }

    try {
        const { id } = req.params;
        const updatedUser = await db.approveMember(id);
        res.json({ message: 'User approved successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ error: 'Failed to approve user' });
    }
});

// Odrzuć członka
router.delete('/:id/reject', authenticateToken, async (req, res) => {
    if (req.user.role !== 'admin' && req.user.username !== 'norbert') {
        return res.status(403).json({ error: 'Admin access required' });
    }

    try {
        const { id } = req.params;
        await db.rejectMember(id);
        res.json({ message: 'User rejected successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to reject user' });
    }
});

router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const user = await db.getUserProfile(req.user.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

router.put('/profile', authenticateToken, [
    body('firstName').optional().notEmpty().withMessage('First name cannot be empty'),
    body('lastName').optional().notEmpty().withMessage('Last name cannot be empty'),
    body('voicePart').optional().isString(),
    body('email').optional().isEmail().withMessage('Valid email required')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, voicePart, email } = req.body;

    const updates = {};
    if (firstName !== undefined) updates.first_name = firstName;
    if (lastName !== undefined) updates.last_name = lastName;
    if (voicePart !== undefined) updates.voice_part = voicePart;
    if (email !== undefined) updates.email = email;

    if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
    }

    try {
        const updatedUser = await db.updateUserProfile(req.user.userId, updates);
        res.json(updatedUser);
    } catch (error) {
        if (error.message.includes('duplicate key')) {
            return res.status(400).json({ error: 'Email already exists' });
        }
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

router.put('/:id/role', authenticateToken, [
    body('role').isIn(['member', 'admin']).withMessage('Role must be member or admin')
], async (req, res) => {
    if (req.user.role !== 'admin' && req.user.username !== 'norbert') {
        return res.status(403).json({ error: 'Admin access required' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { role } = req.body;

    try {
        const updatedUser = await db.updateUser(id, { role });
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user role' });
    }
});

router.delete('/:id', authenticateToken, async (req, res) => {
    if (req.user.role !== 'admin' && req.user.username !== 'norbert') {
        return res.status(403).json({ error: 'Admin access required' });
    }

    const { id } = req.params;

    if (parseInt(id) === req.user.userId) {
        return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    try {
        await db.deleteMember(id);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

module.exports = router;
