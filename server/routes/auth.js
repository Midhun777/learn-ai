const express = require('express');
const router = express.Router();
const User = require('../models/UserModel');
const AuditLog = require('../models/AuditLog');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, username, email, password } = req.body;
        console.log('Registration attempt:', { name, username, email });

        // Check if user exists (email or username)
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'Email is already registered' });
        }

        user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ msg: 'Username is already taken' });
        }

        // Create new user
        user = new User({ name, username, email, password });
        await user.save();

        // Log registration
        const log = new AuditLog({
            userId: user.id,
            action: 'USER_REGISTER',
            metadata: { username: user.username }
        });
        await log.save();

        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5d' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: { id: user.id, username: user.username, email: user.email, role: user.role } });
            }
        );

    } catch (err) {
        console.error('REGISTRATION ERROR:', err);
        res.status(500).json({
            msg: 'Server error',
            error: err.message
        });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // Compare password (Direct string comparison as requested)
        if (password !== user.password) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // Log login
        const log = new AuditLog({
            userId: user.id,
            action: 'USER_LOGIN',
            metadata: { username: user.username }
        });
        await log.save();

        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5d' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: { id: user.id, username: user.username, email: user.email, role: user.role } });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   PUT api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
    try {
        const { name, username, email, isPublic } = req.body;

        // Find user and update
        let user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        if (name) user.name = name;
        if (username) user.username = username;
        if (email) user.email = email;
        if (isPublic !== undefined) user.isPublic = isPublic;

        await user.save();

        res.json({ user: { id: user.id, name: user.name, username: user.username, email: user.email, isPublic: user.isPublic, role: user.role } });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
