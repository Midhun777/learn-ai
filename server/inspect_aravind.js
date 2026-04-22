const mongoose = require('mongoose');
const User = require('./models/UserModel');
const Roadmap = require('./models/Roadmap');
require('dotenv').config({ path: './.env' });

async function inspectUser() {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/learn-ai';
    await mongoose.connect(uri);
    
    const user = await User.findOne({ username: 'aravind' });
    if (!user) {
        console.log('User aravind not found');
        process.exit();
    }

    const roadmaps = await Roadmap.find({ userId: user._id });
    console.log(`Inspecting roadmaps for user: aravind (${user._id})`);
    
    roadmaps.forEach(r => {
        const totalTopics = r.phases.reduce((acc, p) => acc + p.topics.length, 0);
        const completedTopics = r.phases.reduce((acc, p) => acc + p.topics.filter(t => t.completed).length, 0);
        
        console.log(`\nRoadmap: ${r.skill} | progress: ${completedTopics}/${totalTopics} | isCompleted: ${r.isCompleted}`);
        
        r.phases.forEach((p, i) => {
            if (p.handsOnProject) {
                console.log(`  - Phase ${i} Project: status="${p.handsOnProject.status}", completed=${p.handsOnProject.completed}, url="${p.handsOnProject.solutionUrl}"`);
            }
        });
        
        if (r.capstoneProject) {
            console.log(`  - Capstone: status="${r.capstoneProject.status}", completed=${r.capstoneProject.completed}, url="${r.capstoneProject.solutionUrl}"`);
        }
    });

  } catch (err) {
    console.error('Error:', err);
  } finally {
    process.exit();
  }
}

inspectUser();
