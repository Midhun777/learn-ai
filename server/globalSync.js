const mongoose = require('mongoose');
const User = require('./models/UserModel');
const Roadmap = require('./models/Roadmap');
const Progress = require('./models/Progress');
const connectDB = require('./config/db');
require('dotenv').config();

const globalSync = async () => {
    try {
        await connectDB();
        const users = await User.find({ role: 'user' });
        console.log(`Starting global sync for ${users.length} users...`);
        
        for (const user of users) {
            const roadmaps = await Roadmap.find({ userId: user._id });
            console.log(`Syncing ${user.username} - Found ${roadmaps.length} roadmaps.`);
            
            for (const roadmap of roadmaps) {
                let totalTopics = 0;
                let completedTopics = 0;
                
                roadmap.phases.forEach(phase => {
                    phase.topics.forEach(topic => {
                        totalTopics++;
                        if (topic.completed) completedTopics++;
                    });
                });

                const percentage = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
                
                let progress = await Progress.findOne({ userId: user._id, roadmapId: roadmap._id });
                if (progress) {
                    progress.percentage = percentage;
                    progress.status = roadmap.isCompleted ? 'completed' : 'in-progress';
                    progress.roadmapTitle = roadmap.skill;
                    await progress.save();
                } else {
                    progress = new Progress({
                        userId: user._id,
                        roadmapId: roadmap._id,
                        roadmapTitle: roadmap.skill,
                        percentage,
                        status: roadmap.isCompleted ? 'completed' : 'in-progress'
                    });
                    await progress.save();
                }
            }
        }
        console.log('Global sync completed successfully.');
    } catch (error) {
        console.error(error);
    } finally {
        process.exit();
    }
};

globalSync();
