const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isPublic: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: ['user', 'mentor', 'admin'],
        default: 'user'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    xp: {
        type: Number,
        default: 0
    },
    level: {
        type: Number,
        default: 1
    },
    streak: {
        type: Number,
        default: 0
    },
    totalPoints: {
        type: Number,
        default: 0
    },
    badges: [
        {
            name: String,
            icon: String,
            unlockedAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    lastActiveDate: {
        type: String // YYYY-MM-DD
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', UserSchema);
