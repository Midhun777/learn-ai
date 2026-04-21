const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const User = require('../models/UserModel');
const Roadmap = require('../models/Roadmap');
const AuditLog = require('../models/AuditLog');
const bcrypt = require('bcryptjs');

// @route   GET api/admin/stats
// @desc    Get detailed system statistics
// @access  Private/Admin
router.get('/stats', [auth, admin], async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const activeUserCount = await User.countDocuments({ isActive: true });
        const roadmapCount = await Roadmap.countDocuments();
        const certificateCount = await Roadmap.countDocuments({ isCompleted: true });

        // AI Requests Today
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const aiRequestsToday = await AuditLog.countDocuments({
            action: { $regex: /^GENERATION_/ },
            timestamp: { $gte: startOfToday }
        });

        res.json({
            stats: {
                users: userCount,
                activeUsers: activeUserCount,
                roadmaps: roadmapCount,
                certificates: certificateCount,
                aiRequests: aiRequestsToday
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/admin/analytics/growth
// @desc    Get growth analytics for charts
// @access  Private/Admin
router.get('/analytics/growth', [auth, admin], async (req, res) => {
    try {
        // Daily signups (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const dailySignups = await User.aggregate([
            { $match: { createdAt: { $gte: thirtyDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        // Monthly Roadmap activity
        const monthlyActivity = await Roadmap.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        res.json({
            dailySignups: dailySignups.map(d => ({ date: d._id, count: d.count })),
            monthlyActivity: monthlyActivity.map(m => ({ month: m._id, count: m.count }))
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/admin/users
// @desc    Get all users for moderation
// @access  Private/Admin
router.get('/users', [auth, admin], async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/admin/users/:id/status
// @desc    Toggle user active status
// @access  Private/Admin
router.put('/users/:id/status', [auth, admin], async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });
        if (user.id === req.user.id) return res.status(400).json({ msg: 'Cannot deactivate yourself' });

        user.isActive = !user.isActive;
        await user.save();

        const log = new AuditLog({
            userId: req.user.id,
            action: user.isActive ? 'MODERATION_USER_ACTIVATE' : 'MODERATION_USER_DEACTIVATE',
            metadata: { affectedUser: user.username }
        });
        await log.save();

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/admin/users/:id/role
// @desc    Change user role
// @access  Private/Admin
router.put('/users/:id/role', [auth, admin], async (req, res) => {
    try {
        const { role } = req.body;
        if (!['user', 'moderator', 'admin'].includes(role)) {
            return res.status(400).json({ msg: 'Invalid role' });
        }

        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });
        if (user.id === req.user.id) return res.status(400).json({ msg: 'Cannot change your own role' });

        user.role = role;
        await user.save();

        const log = new AuditLog({
            userId: req.user.id,
            action: 'MODERATION_ROLE_CHANGE',
            metadata: { affectedUser: user.username, newRole: role }
        });
        await log.save();

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/admin/users/:id/reset-password
// @desc    Reset user password to a temporary one
// @access  Private/Admin
router.post('/users/:id/reset-password', [auth, admin], async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        const tempPassword = Math.random().toString(36).slice(-8);
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(tempPassword, salt);
        await user.save();

        const log = new AuditLog({
            userId: req.user.id,
            action: 'MODERATION_PASSWORD_RESET',
            metadata: { affectedUser: user.username }
        });
        await log.save();

        res.json({ msg: 'Password reset successfully', tempPassword });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/admin/users/:id
// @desc    Delete a user permanently
// @access  Private/Admin
router.delete('/users/:id', [auth, admin], async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });
        if (user.id === req.user.id) return res.status(400).json({ msg: 'Cannot delete yourself' });

        await User.findByIdAndDelete(req.params.id);

        const log = new AuditLog({
            userId: req.user.id,
            action: 'MODERATION_USER_DELETE',
            metadata: { deletedUser: user.username, email: user.email }
        });
        await log.save();

        res.json({ msg: 'User removed permanently' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/admin/logs
// @desc    Get all audit logs
// @access  Private/Admin
router.get('/logs', [auth, admin], async (req, res) => {
    try {
        const logs = await AuditLog.find()
            .populate('userId', 'username email')
            .sort({ timestamp: -1 })
            .limit(100);
        res.json(logs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/admin/roadmaps
// @desc    Get all roadmaps (with pagination)
// @access  Private/Admin
router.get('/roadmaps', [auth, admin], async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const roadmaps = await Roadmap.find()
            .populate('userId', 'username email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Roadmap.countDocuments();

        res.json({
            roadmaps,
            total,
            page,
            pages: Math.ceil(total / limit)
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/admin/roadmaps/:id
// @desc    Delete a roadmap
// @access  Private/Admin
router.delete('/roadmaps/:id', [auth, admin], async (req, res) => {
    try {
        const roadmap = await Roadmap.findById(req.params.id);
        if (!roadmap) return res.status(404).json({ msg: 'Roadmap not found' });

        await Roadmap.findByIdAndDelete(req.params.id);

        const log = new AuditLog({
            userId: req.user.id,
            action: 'MODERATION_ROADMAP_DELETE',
            metadata: { roadmapId: req.params.id, skill: roadmap.skill }
        });
        await log.save();

        res.json({ msg: 'Roadmap deleted' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Roadmap not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   GET api/admin/pending-projects
// @desc    Get all roadmaps with pending projects
// @access  Private/Admin
router.get('/pending-projects', [auth, admin], async (req, res) => {
    try {
        const roadmaps = await Roadmap.find({
            $or: [
                { 'phases.handsOnProject.status': 'Pending', 'phases.handsOnProject.solutionUrl': { $ne: null } },
                { 'capstoneProject.status': 'Pending', 'capstoneProject.solutionUrl': { $ne: null } }
            ]
        }).populate('userId', 'username email').sort({ updatedAt: -1 });

        res.json(roadmaps);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/admin/roadmaps/:id/approve-project
// @desc    Approve or reject a submitted project
// @access  Private/Admin
router.put('/roadmaps/:id/approve-project', [auth, admin], async (req, res) => {
    try {
        const { phaseIndex, action, isCapstone } = req.body; // action: 'Approve' | 'Reject'
        const roadmap = await Roadmap.findById(req.params.id);
        if (!roadmap) return res.status(404).json({ msg: 'Roadmap not found' });

        const statusLabel = action === 'Approve' ? 'Approved' : 'Rejected';
        const isCompletedNow = action === 'Approve';

        if (isCapstone) {
            if (roadmap.capstoneProject) {
                roadmap.capstoneProject.status = statusLabel;
                roadmap.capstoneProject.completed = isCompletedNow;
            }
        } else if (phaseIndex !== undefined && roadmap.phases[phaseIndex]) {
            if (roadmap.phases[phaseIndex].handsOnProject) {
                roadmap.phases[phaseIndex].handsOnProject.status = statusLabel;
                roadmap.phases[phaseIndex].handsOnProject.completed = isCompletedNow;
            }
        }

        roadmap.markModified('phases');
        if (isCapstone) roadmap.markModified('capstoneProject');
        await roadmap.save();

        const log = new AuditLog({
            userId: req.user.id,
            action: `MODERATION_PROJECT_${action.toUpperCase()}`,
            metadata: { roadmapId: req.params.id, phaseIndex, isCapstone }
        });
        await log.save();

        res.json(roadmap);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
