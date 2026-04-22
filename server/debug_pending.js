const mongoose = require('mongoose');
const Roadmap = require('./server/models/Roadmap');
const User = require('./server/models/UserModel');
require('dotenv').config({ path: './server/.env' });

async function debugData() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/learn-ai');
        console.log('Connected to DB');

        const pendingQuery = {
            $or: [
                { 'phases.handsOnProject.status': 'Pending', 'phases.handsOnProject.solutionUrl': { $ne: null } },
                { 'capstoneProject.status': 'Pending', 'capstoneProject.solutionUrl': { $ne: null } }
            ]
        };

        const roadmaps = await Roadmap.find(pendingQuery).populate('userId');
        console.log('Found roadmaps matching pending query:', roadmaps.length);
        
        roadmaps.forEach(r => {
            console.log(`User: ${r.userId?.username}, Roadmap: ${r.skill}`);
            r.phases.forEach((p, i) => {
                if (p.handsOnProject) {
                    console.log(`  Phase ${i}: Status=${p.handsOnProject.status}, URL=${p.handsOnProject.solutionUrl}`);
                }
            });
        });

        // Also check if there are ANY roadmaps with Pending status but maybe the solutionUrl check is failing
        const anyPending = await Roadmap.find({
            $or: [
                { 'phases.handsOnProject.status': 'Pending' },
                { 'capstoneProject.status': 'Pending' }
            ]
        });
        console.log('Found roadmaps with ANY Pending status:', anyPending.length);

    } catch (err) {
        console.error('Error:', err);
    } finally {
        process.exit();
    }
}

debugData();
