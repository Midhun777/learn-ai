const mongoose = require('mongoose');
const User = require('./models/UserModel');
const Roadmap = require('./models/Roadmap');
require('dotenv').config({ path: './.env' });

async function verify() {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/learn-ai';
    console.log('Connecting to DB...');
    await mongoose.connect(uri);
    
    // THE NEW QUERY
    const pendingQuery = {
        $or: [
            { phases: { $elemMatch: { 'handsOnProject.status': 'Pending', 'handsOnProject.solutionUrl': { $exists: true, $ne: '' } } } },
            { 'capstoneProject.status': 'Pending', 'capstoneProject.solutionUrl': { $exists: true, $ne: '' } }
        ]
    };

    const roadmaps = await Roadmap.find(pendingQuery).populate('userId', 'username');
    console.log(`\nVERIFICATION RESULT:`);
    console.log(`Found ${roadmaps.length} roadmaps matching the new query.`);
    
    roadmaps.forEach(r => {
      console.log(`\nUser: ${r.userId?.username || 'Unknown'} | Skill: ${r.skill}`);
      r.phases.forEach((p, idx) => {
        if (p.handsOnProject && p.handsOnProject.status === 'Pending') {
          console.log(`  - Phase ${idx}: Status=${p.handsOnProject.status}, URL="${p.handsOnProject.solutionUrl}"`);
        }
      });
    });

  } catch (err) {
    console.error('Error:', err);
  } finally {
    process.exit();
  }
}

verify();
