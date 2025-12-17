const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Roadmap = require('../models/Roadmap');
const { generateRoadmap } = require('../services/geminiService');

// @route   POST api/roadmap/generate
// @desc    Generate a roadmap using AI
// @access  Private
router.post('/generate', auth, async (req, res) => {
    try {
        const { skill } = req.body;
        if (!skill) {
            return res.status(400).json({ msg: 'Skill is required' });
        }

        const roadmapData = await generateRoadmap(skill);
        res.json(roadmapData);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/roadmap/save
// @desc    Save a generated roadmap
// @access  Private
router.post('/save', auth, async (req, res) => {
    try {
        const { skill, phases, capstoneProject } = req.body;

        const newRoadmap = new Roadmap({
            userId: req.user.id,
            skill,
            phases,
            capstoneProject
        });

        const roadmap = await newRoadmap.save();
        res.json(roadmap);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/roadmap/user/all
// @desc    Get all roadmaps for the logged in user
// @access  Private
router.get('/user/all', auth, async (req, res) => {
    try {
        const roadmaps = await Roadmap.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(roadmaps);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/roadmap/:id
// @desc    Get roadmap by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
    try {
        const roadmap = await Roadmap.findById(req.params.id);
        if (!roadmap) {
            return res.status(404).json({ msg: 'Roadmap not found' });
        }
        // Check user
        if (roadmap.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }
        res.json(roadmap);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Roadmap not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/roadmap/:id/update
// @desc    Update roadmap progress
// @access  Private
router.put('/:id/update', auth, async (req, res) => {
    try {
        const { phases, capstoneProject, isCompleted } = req.body;

        let roadmap = await Roadmap.findById(req.params.id);
        if (!roadmap) {
            return res.status(404).json({ msg: 'Roadmap not found' });
        }

        if (roadmap.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        roadmap.phases = phases;
        roadmap.capstoneProject = capstoneProject;
        roadmap.isCompleted = isCompleted;

        await roadmap.save();
        res.json(roadmap);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/roadmap/:id
// @desc    Delete a roadmap
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const roadmap = await Roadmap.findById(req.params.id);

        if (!roadmap) {
            return res.status(404).json({ msg: 'Roadmap not found' });
        }

        // Check user
        if (roadmap.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await roadmap.deleteOne();

        res.json({ msg: 'Roadmap removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Roadmap not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   POST api/roadmap/explain
// @desc    Get an explanation for a topic
// @access  Private
router.post('/explain', auth, async (req, res) => {
    try {
        const { topic, skill } = req.body;
        const { getExplanation } = require('../services/geminiService');

        const explanation = await getExplanation(topic, skill);
        res.json(explanation);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/roadmap/chat
// @desc    Chat with AI Tutor
// @access  Private
router.post('/chat', auth, async (req, res) => {
    try {
        const response = await chatWithAI(message, skill);
        res.json({ reply: response });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/roadmap/:id/schedule
// @desc    Generate AI Study Schedule
// @access  Private
router.post('/:id/schedule', auth, async (req, res) => {
    try {
        const { hoursPerWeek } = req.body;
        const roadmap = await Roadmap.findById(req.params.id);

        if (!roadmap || roadmap.userId.toString() !== req.user.id) {
            return res.status(404).json({ msg: 'Roadmap not found' });
        }

        const { generateStudySchedule } = require('../services/geminiService');

        // Flatten topics for AI processing
        let allTopics = [];
        roadmap.phases.forEach((phase, pIdx) => {
            phase.topics.forEach((topic, tIdx) => {
                if (!topic.completed) {
                    allTopics.push({ name: topic.topicName, pIdx, tIdx });
                }
            });
        });

        let scheduleMap;
        try {
            scheduleMap = await generateStudySchedule(allTopics.map(t => t.name), hoursPerWeek);
            console.log('AI Schedule Success');
        } catch (aiError) {
            console.error('AI Schedule Failed, switching to manual fallback', aiError.message);
            // Fallback: 2 topics per week (assuming 5h/week, 2.5h/topic)
            scheduleMap = {};
            const topicsPerWeek = Math.max(1, Math.floor(hoursPerWeek / 2.5));
            const currentDate = new Date();

            allTopics.forEach((_, idx) => {
                const weeksToAdd = Math.floor(idx / topicsPerWeek);
                const date = new Date(currentDate);
                date.setDate(date.getDate() + (weeksToAdd * 7) + 2); // Due in 2 days + weeks
                scheduleMap[idx] = date.toISOString().split('T')[0];
            });
        }

        // Map deadlines back to roadmap
        let updatesCount = 0;
        Object.keys(scheduleMap).forEach(key => {
            const deadline = scheduleMap[key];
            const dateObj = new Date(deadline);

            // Try index-based lookup (Standard)
            const flatIdx = parseInt(key);
            if (!isNaN(flatIdx) && allTopics[flatIdx]) {
                const { pIdx, tIdx } = allTopics[flatIdx];
                if (roadmap.phases[pIdx]?.topics[tIdx]) {
                    roadmap.phases[pIdx].topics[tIdx].dueDate = dateObj;
                    updatesCount++;
                }
            }
        });

        console.log(`Updated deadlines for ${updatesCount} topics`);
        roadmap.markModified('phases'); // Force Mongoose to see the changes
        await roadmap.save();
        res.json(roadmap);

    } catch (err) {
        console.error("Schedule Route Error:", err.message);
        res.status(500).json({ msg: 'Server Error', error: err.message });
    }
});

// @route   PUT api/roadmap/:id/topic/time
// @desc    Log time spent on a topic
// @access  Private
router.put('/:id/topic/time', auth, async (req, res) => {
    try {
        const { phaseIndex, topicIndex, timeSpentSeconds } = req.body;
        const roadmap = await Roadmap.findById(req.params.id);

        if (!roadmap || roadmap.userId.toString() !== req.user.id) {
            return res.status(404).json({ msg: 'Roadmap not found' });
        }

        // Add time (convert sec to min)
        const currentMinutes = roadmap.phases[phaseIndex].topics[topicIndex].timeSpent || 0;
        roadmap.phases[phaseIndex].topics[topicIndex].timeSpent = currentMinutes + (timeSpentSeconds / 60);

        await roadmap.save();
        res.json(roadmap);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
