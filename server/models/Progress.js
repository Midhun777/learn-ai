const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    roadmapId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Roadmap',
        required: true
    },
    roadmapTitle: {
        type: String,
        required: true
    },
    percentage: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['in-progress', 'completed'],
        default: 'in-progress'
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

// Update lastUpdated on save
ProgressSchema.pre('save', async function() {
    this.lastUpdated = Date.now();
});

module.exports = mongoose.model('Progress', ProgressSchema);
