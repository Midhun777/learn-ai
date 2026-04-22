const mongoose = require('mongoose');
const path = require('path');
const User = require('./models/UserModel');
const Roadmap = require('./models/Roadmap');
require('dotenv').config({ path: './.env' });

async function verify() {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/learn-ai';
    console.log('Connecting to DB...');
    await mongoose.connect(uri);
    
    // Find a roadmap that IS 100% but maybe not completed
    const roadmaps = await Roadmap.find().populate('userId');
    
    for (const r of roadmaps) {
        const totalTopics = r.phases.reduce((acc, p) => acc + p.topics.length, 0);
        const completedTopics = r.phases.reduce((acc, p) => acc + p.topics.filter(t => t.completed).length, 0);
        const progress = Math.round((completedTopics / totalTopics) * 100);
        
        console.log(`Path: ${r.skill} | Progress: ${progress}% | isCompleted: ${r.isCompleted}`);
        
        if (progress === 100 && !r.isCompleted) {
            console.log(`  -> Detected bugged state for ${r.userId?.username}. Recalculating...`);
            
            let allProjectsFinished = true;
            r.phases.forEach(p => {
                if (p.handsOnProject && (!p.handsOnProject.solutionUrl || p.handsOnProject.status !== 'Approved')) {
                    allProjectsFinished = false;
                    console.log(`     - Phase project not approved: ${p.handsOnProject.status}`);
                }
            });
            if (r.capstoneProject && (!r.capstoneProject.solutionUrl || r.capstoneProject.status !== 'Approved')) {
                allProjectsFinished = false;
                console.log(`     - Capstone project not approved: ${r.capstoneProject.status}`);
            }
            
            const newIsCompleted = allProjectsFinished;
            console.log(`     - New calculated status: ${newIsCompleted}`);
            
            if (newIsCompleted) {
                r.isCompleted = true;
                await r.save();
                console.log(`     - FIXED: marked as Completed.`);
            }
        }
    }

  } catch (err) {
    console.error('Error:', err);
  } finally {
    process.exit();
  }
}

verify();
