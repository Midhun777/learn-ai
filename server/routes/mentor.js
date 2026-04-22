const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const mentor = require('../middleware/mentor');
const User = require('../models/UserModel');
const Message = require('../models/Message');
const Progress = require('../models/Progress');
const Roadmap = require('../models/Roadmap');

// @route   GET api/mentor/users
// @desc    Get all users with their aggregate progress
// @access  Mentor/Admin
router.get('/users', [auth, mentor], async (req, res) => {
    try {
        const users = await User.find({ role: 'user' }).select('-password');
        
        // Fetch progress for each user
        const usersWithProgress = await Promise.all(users.map(async (user) => {
            const progress = await Progress.find({ userId: user._id });
            return {
                ...user._doc,
                progressCount: progress.length,
                overallProgress: progress.length > 0 
                    ? Math.round(progress.reduce((acc, curr) => acc + curr.percentage, 0) / progress.length)
                    : 0
            };
        }));

        res.json(usersWithProgress);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/mentor/user/:userId/progress
// @desc    Get detailed progress for a specific user
// @access  Mentor/Admin
router.get('/user/:userId/progress', [auth, mentor], async (req, res) => {
    try {
        const progress = await Progress.find({ userId: req.params.userId }).sort({ lastUpdated: -1 });
        res.json(progress);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/mentor/message
// @desc    Send guidance message to a user/mentor
// @access  Private
router.post('/message', auth, async (req, res) => {
    try {
        const { recipientId, content } = req.body;

        if (!recipientId || !content) {
            return res.status(400).json({ msg: 'Please provide recipient and content' });
        }

        const newMessage = new Message({
            sender: req.user.id,
            recipient: recipientId,
            content
        });

        const message = await newMessage.save();
        res.json(message);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/mentor/messages/:userId
// @desc    Get message history between mentor and user
// @access  Private
router.get('/messages/:userId', auth, async (req, res) => {
    try {
        const messages = await Message.find({
            $or: [
                { sender: req.user.id, recipient: req.params.userId },
                { sender: req.params.userId, recipient: req.user.id }
            ]
        }).sort({ createdAt: 1 });
        res.json(messages);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/mentor/user-messages
// @desc    Get messages for the logged-in user (from mentors)
// @access  Private (User)
router.get('/my-messages', auth, async (req, res) => {
    try {
        const messages = await Message.find({ 
            $or: [{ recipient: req.user.id }, { sender: req.user.id }] 
        })
            .populate('sender', 'name username role')
            .populate('recipient', 'name username role')
            .sort({ createdAt: -1 });
        res.json(messages);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/mentor/sync-progress/:userId
// @desc    Sync/Calculate progress from Roadmaps to Progress collection
// @access  Mentor/Admin/User
router.post('/sync-progress/:userId', auth, async (req, res) => {
    try {
        const roadmaps = await Roadmap.find({ userId: req.params.userId });
        
        const syncResults = await Promise.all(roadmaps.map(async (roadmap) => {
            // Calculate percentage
            let totalTopics = 0;
            let completedTopics = 0;
            
            roadmap.phases.forEach(phase => {
                phase.topics.forEach(topic => {
                    totalTopics++;
                    if (topic.completed) completedTopics++;
                });
            });

            const percentage = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
            
            // Update or Create Progress entry
            let progress = await Progress.findOne({ userId: roadmap.userId, roadmapId: roadmap._id });
            
            if (progress) {
                progress.percentage = percentage;
                progress.status = roadmap.isCompleted ? 'completed' : 'in-progress';
                progress.roadmapTitle = roadmap.skill;
                await progress.save();
            } else {
                progress = new Progress({
                    userId: roadmap.userId,
                    roadmapId: roadmap._id,
                    roadmapTitle: roadmap.skill,
                    percentage,
                    status: roadmap.isCompleted ? 'completed' : 'in-progress'
                });
                await progress.save();
            }
            return progress;
        }));

        res.json(syncResults);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/mentor/pending-projects
// @desc    Get all roadmaps with pending projects
// @access  Mentor/Admin
router.get('/pending-projects', [auth, mentor], async (req, res) => {
    try {
        const roadmaps = await Roadmap.find({
            $or: [
                { phases: { $elemMatch: { 'handsOnProject.status': 'Pending', 'handsOnProject.solutionUrl': { $exists: true, $ne: '' } } } },
                { 'capstoneProject.status': 'Pending', 'capstoneProject.solutionUrl': { $exists: true, $ne: '' } }
            ]
        }).populate('userId', 'username email').sort({ updatedAt: -1 });

        res.json(roadmaps);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/mentor/roadmaps/:id/approve-project
// @desc    Approve or reject a submitted project
// @access  Mentor/Admin
router.put('/roadmaps/:id/approve-project', [auth, mentor], async (req, res) => {
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

        // Recalculate global completion status
        const totalTopics = roadmap.phases.reduce((acc, p) => acc + p.topics.length, 0);
        const completedTopics = roadmap.phases.reduce((acc, p) => acc + p.topics.filter(t => t.completed).length, 0);
        
        let allProjectsFinished = true;
        roadmap.phases.forEach(p => {
            if (p.handsOnProject && (!p.handsOnProject.solutionUrl || p.handsOnProject.status !== 'Approved')) {
                allProjectsFinished = false;
            }
        });
        if (roadmap.capstoneProject && (!roadmap.capstoneProject.solutionUrl || roadmap.capstoneProject.status !== 'Approved')) {
            allProjectsFinished = false;
        }

        roadmap.isCompleted = (totalTopics === completedTopics) && allProjectsFinished;

        await roadmap.save();

        res.json(roadmap);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
