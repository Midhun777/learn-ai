const express = require('express');
const router = express.Router();
const User = require('../models/UserModel');
const Roadmap = require('../models/Roadmap');

// @route   GET api/public/profile/:username
// @desc    Get public profile by Username
// @access  Public
router.get('/profile/:username', async (req, res) => {
    try {
        // Fetch User and check privacy
        const user = await User.findOne({ username: req.params.username }).select('-password -email');
        
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Enforcement: If profile is not public, return error
        if (!user.isPublic) {
            return res.status(403).json({ msg: 'This profile is private' });
        }

        // Fetch User Roadmaps (Learning Paths)
        const roadmaps = await Roadmap.find({ userId: user._id }).sort({ createdAt: -1 });

        // Calculate simplified stats
        const completedCount = roadmaps.filter(r => r.isCompleted).length;

        res.json({
            user,
            stats: {
                joined: user.createdAt,
                completedCount,
                totalCount: roadmaps.length
            },
            roadmaps: roadmaps
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
