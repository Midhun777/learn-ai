const mongoose = require('mongoose');
const User = require('./models/UserModel');
const Roadmap = require('./models/Roadmap');
const connectDB = require('./config/db');
require('dotenv').config();

const checkRoadmaps = async () => {
    try {
        await connectDB();
        const users = await User.find({ role: 'user' });
        console.log(`Found ${users.length} users.`);
        
        for (const user of users) {
            const count = await Roadmap.countDocuments({ userId: user._id });
            console.log(`User: ${user.username} (${user.email}) - Roadmaps: ${count}`);
        }
    } catch (error) {
        console.error(error);
    } finally {
        process.exit();
    }
};

checkRoadmaps();
