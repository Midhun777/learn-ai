const mongoose = require('mongoose');
const Progress = require('./models/Progress');
const connectDB = require('./config/db');
require('dotenv').config();

const checkProgress = async () => {
    try {
        await connectDB();
        const progress = await Progress.find();
        console.log(`Found ${progress.length} progress entries.`);
        for (const p of progress) {
            console.log(`User ID: ${p.userId} - Roadmap: ${p.roadmapTitle} - %: ${p.percentage}`);
        }
    } catch (error) {
        console.error(error);
    } finally {
        process.exit();
    }
};

checkProgress();
