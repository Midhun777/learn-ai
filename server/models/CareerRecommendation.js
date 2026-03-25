const mongoose = require('mongoose');

const CareerRecommendationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    skills: {
        type: [String],
        required: true
    },
    interests: {
        type: [String],
        default: []
    },
    experienceLevel: {
        type: String,
        default: 'beginner'
    },
    recommendations: [
        {
            role: String,
            description: String,
            matchPercentage: Number,
            salaryRange: String,
            keySkillsRequired: [String]
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('CareerRecommendation', CareerRecommendationSchema);
