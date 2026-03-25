require('dotenv').config();
const { generateRoadmap } = require('./services/geminiService');

(async () => {
    try {
        const result = await generateRoadmap({
            skill: "React",
            skillLevel: "beginner",
            deadlineDays: 30,
            hoursPerDay: 2,
            learningGoal: "general knowledge"
        });
        console.log("SUCCESS:", JSON.stringify(result, null, 2));
    } catch (e) {
        console.error("FAIL:", e.message);
        console.error(e.stack);
    }
})();
