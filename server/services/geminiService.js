const axios = require('axios');

const generateRoadmap = async ({ skill, skillLevel, deadlineDays, hoursPerDay, learningGoal }) => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        const promptText = `
        You are an AI learning assistant that generates structured learning roadmaps.

        Based on the user's learning details, create a personalized roadmap to help them achieve their goal within the specified time.
        
        User Details:
        Skill to Learn: ${skill}
        Current Skill Level: ${skillLevel || 'beginner'}
        Learning Deadline: ${deadlineDays || 30} days
        Daily Study Time: ${hoursPerDay || 2} hours
        Learning Goal: ${learningGoal || 'job preparation'}

        Instructions:
        1. Generate a clear step-by-step learning roadmap.
        2. Divide the roadmap into phases or weeks based on the deadline.
        3. Adjust the difficulty based on the user's skill level.
        4. Suggest useful resources such as: Documentation, YouTube tutorials, Online courses, Practice exercises.
        5. Include small tasks or mini-projects for each phase.
        6. Suggest one final capstone project at the end.
        7. Ensure the roadmap fits within the user's daily learning time.
        8. Keep the roadmap practical and beginner-friendly if the user is a beginner.

        CRITICAL OUTPUT FORMAT REQUIREMENT:
        Return ONLY a raw JSON object (no markdown formatting, no backticks) with this exact structure:
        {
          "skill": "${skill}",
          "description": "Short description of the roadmap objective",
          "phases": [
            {
              "name": "Phase Name (e.g. Week 1: Core Concepts)",
              "estimatedTime": "Time duration",
              "topics": [
                {
                  "title": "Topic Title",
                  "description": "Short explanation of what will be learned",
                  "time": "e.g. 2 hours",
                  "resources": [
                    {"name": "Resource Name", "url": "URL (CRITICAL: MUST be a real verifiable link OR a YouTube search link like https://www.youtube.com/results?search_query=topic+name. NEVER make up fake URLs.)"}
                  ]
                }
              ],
              "handsOnProject": {"title": "Project Title", "description": "Short description"}
            }
          ],
          "capstoneProject": {"title": "Capstone Title", "description": "Project description"}
        }
        Generate at least 3 phases corresponding to the timeline.
        `;

        const response = await axios.post(
            url,
            {
                contents: [{ parts: [{ text: promptText }] }],
                generationConfig: { responseMimeType: "application/json" }
            },
            {
                headers: { 'Content-Type': 'application/json' }
            }
        );

        let generatedText = response.data.candidates[0].content.parts[0].text;

        // Robust JSON extraction
        const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('No JSON structure found in response');
        }

        const jsonStr = jsonMatch[0];
        return JSON.parse(jsonStr);

    } catch (error) {
        console.error('Gemini API Error:', error.response?.data || error.message);
        throw new Error('Failed to generate roadmap');
    }

};

const getExplanation = async (topic, skill) => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        const promptText = `
        Explain the concept "${topic}" in the context of learning "${skill}".
        
        Structure your response exactly like this in valid Markdown:
        
        ### 💡 Simple Explanation
        (Provide a super simple, easy-to-understand explanation using a real-world analogy. ELI5 style. Max 3 sentences.)
        
        ### 📘 Technical Deep Dive
        (Provide the professional, industry-standard technical definition and explanation. Be precise and detailed. Max 3-4 sentences.)
        
        ### 🔑 Key Points
        (Provide 2-3 bullet points on why this concept is critical.)
        
        Return ONLY a raw JSON object with this structure:
        {
          "explanation": "The full markdown string containing all the sections above",
          "code": "A relevant code snippet example (or null)",
          "language": "programming language name (or null)"
        }
        `;

        const response = await axios.post(
            url,
            {
                contents: [{ parts: [{ text: promptText }] }]
            },
            {
                headers: { 'Content-Type': 'application/json' }
            }
        );

        let generatedText = response.data.candidates[0].content.parts[0].text;
        generatedText = generatedText.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(generatedText);

    } catch (error) {
        console.error('Gemini Explanation Error:', error.response?.data || error.message);
        return {
            explanation: "Failed to generate explanation at this time.",
            code: null
        };
    }
};



const generateStudySchedule = async (topics, hoursPerWeek = 5) => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        const promptText = `
        I have a list of topics to learn:
        ${JSON.stringify(topics)}

        I have ${hoursPerWeek} hours available per week.
        
        Assign a realistic Deadline (Due Date) for each topic, starting from today (${new Date().toISOString()}).
        assume I learn strictly sequentially.
        
        CRITICAL: Return ONLY a JSON object where the KEY is the array index (0, 1, 2...) of the topic, and the VALUE is the date (YYYY-MM-DD).
        Example:
        {
            "0": "2023-10-25",
            "1": "2023-10-27"
        }
        `;

        const response = await axios.post(
            url,
            {
                contents: [{ parts: [{ text: promptText }] }],
                generationConfig: { responseMimeType: "application/json" }
            },
            { headers: { 'Content-Type': 'application/json' } }
        );

        const text = response.data.candidates[0].content.parts[0].text;

        // Robust JSON extraction
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('No JSON structure found in response');
        }

        const jsonStr = jsonMatch[0];
        return JSON.parse(jsonStr);

    } catch (error) {
        console.error('Gemini Schedule Error:', error);
        throw new Error('Failed to generate schedule');
    }
};

const generateCareerRecommendation = async (skills, interests, experienceLevel) => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        const promptText = `
        You are an expert AI Career Counselor.

        Based on the user's profile, recommend the top 3-5 best-fitting career paths or job roles.

        User Profile:
        Skills: ${skills.join(', ')}
        Interests: ${interests.join(', ')}
        Experience Level: ${experienceLevel}

        CRITICAL OUTPUT FORMAT REQUIREMENT:
        Return ONLY a raw JSON object (no markdown formatting, no backticks) with this structure:
        {
          "recommendations": [
            {
              "role": "Job Title (e.g., Frontend Developer)",
              "description": "Short explanation of why this fits and what they would do.",
              "matchPercentage": 95,
              "salaryRange": "Estimated salary range based on experience level",
              "keySkillsRequired": ["React", "CSS", "JavaScript"]
            }
          ]
        }
        `;

        const response = await axios.post(
            url,
            {
                contents: [{ parts: [{ text: promptText }] }],
                generationConfig: { responseMimeType: "application/json" }
            },
            { headers: { 'Content-Type': 'application/json' } }
        );

        let generatedText = response.data.candidates[0].content.parts[0].text;
        
        // Robust JSON extraction
        const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('No JSON structure found in response');
        }

        const jsonStr = jsonMatch[0];
        return JSON.parse(jsonStr);

    } catch (error) {
        console.error('Gemini Career Recommendation Error:', error.response?.data || error.message);
        throw new Error('Failed to generate career recommendations');
    }
};

module.exports = { generateRoadmap, getExplanation, generateStudySchedule, generateCareerRecommendation };
