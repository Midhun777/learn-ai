const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Roadmap = require('../models/Roadmap');
const AuditLog = require('../models/AuditLog');
const { generateRoadmap } = require('../services/geminiService');
const GamificationService = require('../services/gamificationService');

// @route   POST api/roadmap/generate
// @desc    Generate a roadmap using AI
// @access  Private
router.post('/generate', auth, async (req, res) => {
    try {
        const { skill, skillLevel, deadlineDays, hoursPerDay, learningGoal } = req.body;
        if (!skill) {
            return res.status(400).json({ msg: 'Skill is required' });
        }

        const roadmapData = await generateRoadmap({ 
            skill, 
            skillLevel, 
            deadlineDays, 
            hoursPerDay, 
            learningGoal 
        });

        // Log generation
        const log = new AuditLog({
            userId: req.user.id,
            action: 'ROADMAP_GENERATE',
            metadata: { skill }
        });
        await log.save();

        res.json(roadmapData);
    } catch (err) {
        console.error(err.message);
        require('fs').appendFileSync('generate_error.log', (err.stack || err.message) + '\\n');
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

        // Log save
        const log = new AuditLog({
            userId: req.user.id,
            action: 'ROADMAP_SAVE',
            targetId: roadmap.id,
            targetModel: 'Roadmap',
            metadata: { skill }
        });
        await log.save();
 
        // Gamification: Award XP for saving roadmap
        await GamificationService.awardXP(req.user.id, 50, 'Roadmap Saved');
        await GamificationService.updateStreak(req.user.id);

        res.json(roadmap);
    } catch (err) {
        console.error(err.message);
        require('fs').appendFileSync('save_error.log', (err.stack || err.message) + '\n');
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

        // Gamification: Detect newly completed topics
        let xpGained = 0;
        const oldPhases = roadmap.phases;
        
        phases.forEach((phase, pIdx) => {
            phase.topics.forEach((topic, tIdx) => {
                const wasCompleted = oldPhases[pIdx]?.topics[tIdx]?.completed;
                if (topic.completed && !wasCompleted) {
                    xpGained += 20;
                }
            });
        });

        roadmap.phases = phases;
        roadmap.capstoneProject = capstoneProject;
        roadmap.isCompleted = isCompleted;
 
        await roadmap.save();

        if (xpGained > 0) {
            await GamificationService.awardXP(req.user.id, xpGained, 'Topics Completed');
        }
        await GamificationService.updateStreak(req.user.id);

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
                    allTopics.push({ name: topic.title || topic.topicName, pIdx, tIdx });
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

// @route   GET api/roadmap/user/career-data
// @desc    Aggregate career data (Skills, Projects, Certificates)
// @access  Private
router.get('/user/career-data', auth, async (req, res) => {
    try {
        const roadmaps = await Roadmap.find({ userId: req.user.id });

        const careerData = {
            skills: [],
            projects: [],
            certificates: []
        };

        roadmaps.forEach(roadmap => {
            // Aggregate Skills
            if (roadmap.skill && !careerData.skills.includes(roadmap.skill)) {
                careerData.skills.push(roadmap.skill);
            }

            // Aggregate Certificates
            if (roadmap.isCompleted) {
                careerData.certificates.push({
                    id: roadmap._id,
                    skill: roadmap.skill,
                    completedAt: roadmap.updatedAt || roadmap.createdAt
                });
            }

            // Aggregate Projects
            roadmap.phases.forEach(phase => {
                // Phase Projects
                if (phase.handsOnProject && phase.handsOnProject.completed) {
                    careerData.projects.push({
                        title: phase.handsOnProject.title,
                        description: phase.handsOnProject.description,
                        skill: roadmap.skill,
                        type: 'Phase Project'
                    });
                }
            });

            // Capstone Projects
            if (roadmap.capstoneProject && roadmap.capstoneProject.completed) {
                careerData.projects.push({
                    title: roadmap.capstoneProject.title,
                    description: roadmap.capstoneProject.description,
                    skill: roadmap.skill,
                    type: 'Capstone Challenge'
                });
            }
        });

        res.json(careerData);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/roadmap/:id/phase/:phaseIndex/project
// @desc    Submit Phase Project
// @access  Private
router.put('/:id/phase/:phaseIndex/project', auth, async (req, res) => {
    try {
        const { solutionUrl } = req.body;
        const phaseIndex = parseInt(req.params.phaseIndex);
        const roadmap = await Roadmap.findById(req.params.id);

        if (!roadmap || roadmap.userId.toString() !== req.user.id) {
            return res.status(404).json({ msg: 'Roadmap not found' });
        }

        if (!roadmap.phases[phaseIndex] || !roadmap.phases[phaseIndex].handsOnProject) {
            return res.status(404).json({ msg: 'Project not found' });
        }

        roadmap.phases[phaseIndex].handsOnProject.completed = false; // Requires approval
        roadmap.phases[phaseIndex].handsOnProject.status = 'Pending';
        roadmap.phases[phaseIndex].handsOnProject.solutionUrl = solutionUrl;
        roadmap.phases[phaseIndex].handsOnProject.submittedAt = new Date();

        roadmap.markModified('phases');
        await roadmap.save();

        // Gamification: Award XP for project submission
        await GamificationService.awardXP(req.user.id, 150, 'Project Submitted');
        await GamificationService.updateStreak(req.user.id);

        res.json(roadmap);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/roadmap/clone/:id
// @desc    Clone a roadmap to user's profile
// @access  Private
router.post('/clone/:id', auth, async (req, res) => {
    try {
        const originalRoadmap = await Roadmap.findById(req.params.id);
        if (!originalRoadmap) {
            return res.status(404).json({ msg: 'Roadmap not found' });
        }

        // Deep clone phases while resetting status
        const clonedPhases = originalRoadmap.phases.map(phase => {
            const phaseObj = phase.toObject ? phase.toObject() : JSON.parse(JSON.stringify(phase));
            
            return {
                ...phaseObj,
                topics: (phaseObj.topics || []).map(topic => ({
                    ...topic,
                    completed: false,
                    timeSpent: 0,
                    dueDate: null,
                    completedAt: null
                })),
                handsOnProject: phaseObj.handsOnProject ? {
                    ...phaseObj.handsOnProject,
                    completed: false,
                    solutionUrl: null,
                    submittedAt: null
                } : null
            };
        });

        const newRoadmap = new Roadmap({
            userId: req.user.id,
            skill: originalRoadmap.skill,
            description: originalRoadmap.description,
            phases: clonedPhases,
            capstoneProject: originalRoadmap.capstoneProject ? {
                ...originalRoadmap.capstoneProject.toObject(),
                completed: false,
                solutionUrl: null,
                submittedAt: null
            } : null,
            isCompleted: false
        });

        const roadmap = await newRoadmap.save();

        // Log cloning
        const log = new AuditLog({
            userId: req.user.id,
            action: 'ROADMAP_CLONE',
            targetId: roadmap.id,
            targetModel: 'Roadmap',
            metadata: { 
                originalRoadmapId: originalRoadmap.id,
                skill: roadmap.skill 
            }
        });
        await log.save();

        // Award points for path discovery
        await GamificationService.awardXP(req.user.id, 20, 'Path Discovered');

        res.json(roadmap);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
