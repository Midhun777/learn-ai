const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Roadmap = require('../models/Roadmap');

// @route   GET api/public/profile/:id
// @desc    Get public profile by User ID
// @access  Public
router.get('/profile/:id', async (req, res) => {
    try {
        // Fetch User (exclude password and email for privacy)
        const user = await User.findById(req.params.id).select('-password -email');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Fetch Completed Roadmaps
        // We can just fetch all and let frontend decide, or just completed.
        // Let's fetch all so we can show "Currently Learning" too if we want later.
        const roadmaps = await Roadmap.find({ userId: req.params.id }).sort({ createdAt: -1 });

        // Calculate Stats
        const completedRoadmaps = roadmaps.filter(r => r.isCompleted);
        const totalSkills = roadmaps.length;

        // Response
        res.json({
            user,
            stats: {
                joined: user.createdAt,
                completedCount: completedRoadmaps.length,
                totalCount: totalSkills,
                topSkills: completedRoadmaps.map(r => r.skill).slice(0, 3)
            },
            roadmaps: roadmaps // Sending all for now, frontend can filter
        });

    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;
