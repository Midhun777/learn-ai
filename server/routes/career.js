const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const CareerRecommendation = require('../models/CareerRecommendation');
const AuditLog = require('../models/AuditLog');
const { generateCareerRecommendation } = require('../services/geminiService');

// @route   POST api/career/recommend
// @desc    Generate a career recommendation using AI
// @access  Private
router.post('/recommend', auth, async (req, res) => {
    try {
        const { skills, interests, experienceLevel } = req.body;
        if (!skills || !Array.isArray(skills) || skills.length === 0) {
            return res.status(400).json({ msg: 'Skills are required and must be an array' });
        }

        const recommendationData = await generateCareerRecommendation(
            skills, 
            interests || [], 
            experienceLevel || 'beginner'
        );

        // Save to DB
        const newCareerRec = new CareerRecommendation({
            userId: req.user.id,
            skills,
            interests: interests || [],
            experienceLevel: experienceLevel || 'beginner',
            recommendations: recommendationData.recommendations || []
        });

        const savedRec = await newCareerRec.save();

        // Log generation
        const log = new AuditLog({
            userId: req.user.id,
            action: 'CAREER_RECOMMENDATION_GENERATE',
            targetId: savedRec.id,
            targetModel: 'CareerRecommendation',
            metadata: { skills }
        });
        await log.save();

        res.json(savedRec);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/career/history
// @desc    Get all career recommendations for the logged in user
// @access  Private
router.get('/history', auth, async (req, res) => {
    try {
        const recommendations = await CareerRecommendation.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(recommendations);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
