const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/UserModel');

// @route   GET api/gamification/leaderboard
// @desc    Get top users by level and XP
// @access  Private
router.get('/leaderboard', auth, async (req, res) => {
    try {
        const topUsers = await User.find({ role: 'user' })
            .select('name username level xp streak badges')
            .sort({ level: -1, xp: -1 })
            .limit(20);
        
        res.json(topUsers);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/gamification/stats
// @desc    Get current user's gamification stats
// @access  Private
router.get('/stats', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('level xp streak badges totalPoints lastActiveDate');
        if (!user) return res.status(404).json({ msg: 'User not found' });

        // Calculate XP needed for next level
        // Formula: Next Level XP = Level * 500
        const xpNeeded = user.level * 500;
        const progress = Math.round((user.xp / xpNeeded) * 100);

        res.json({
            ...user._doc,
            xpNeeded,
            progress
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
