const mongoose = require('mongoose');

const RoadmapSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    skill: {
        type: String,
        required: true
    },
    phases: [
        {
            name: String, // e.g. Beginner, Intermediate, Advanced
            topics: [
                {
                    topicName: String, // Keeping for compatibility
                    title: String,
                    description: String,
                    time: String, // Estimated duration
                    resources: [
                        {
                            name: String,
                            url: String
                        }
                    ],
                    completed: {
                        type: Boolean,
                        default: false
                    },
                    timeSpent: {
                        type: Number, // In minutes
                        default: 0
                    },
                    dueDate: {
                        type: Date
                    },
                    completedAt: {
                        type: Date
                    }
                }
            ],
            estimatedTime: String,
            resources: [
                {
                    title: String,
                    url: String,
                    type: { type: String }, // 'documentation', 'video', 'website'
                    completed: {
                        type: Boolean,
                        default: false
                    }
                }
            ],
            handsOnProject: {
                title: String,
                description: String,
                completed: {
                    type: Boolean,
                    default: false
                },
                solutionUrl: {
                    type: String
                },
                submittedAt: {
                    type: Date
                },
                status: {
                    type: String,
                    enum: ['Pending', 'Approved', 'Rejected'],
                    default: 'Pending'
                }
            }
        }
    ],
    capstoneProject: {
        title: String,
        description: String,
        completed: {
            type: Boolean,
            default: false
        },
        solutionUrl: {
            type: String
        },
        submittedAt: {
            type: Date
        },
        status: {
            type: String,
            enum: ['Pending', 'Approved', 'Rejected'],
            default: 'Pending'
        }
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Roadmap', RoadmapSchema);
