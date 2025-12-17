const axios = require('axios');

const generateRoadmap = async (skill) => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        const promptText = `
        Create a detailed learning roadmap for: "${skill}".
        Return ONLY a raw JSON object (no markdown formatting, no backticks) with this structure:
        {
          "skill": "${skill}",
          "description": "Short description",
          "phases": [
            {
              "phaseName": "Beginner",
              "estimatedTime": "Time duration",
              "topics": [{"topicName": "Topic 1"}, {"topicName": "Topic 2"}],
              "resources": [{"title": "Resource Title", "url": "URL", "type": "documentation/video/website"}],
              "handsOnProject": {"title": "Project Title", "description": "Short description"}
            },
           // ... Intermediate and Advanced phases
          ],
          "capstoneProject": {"title": "Capstone Title", "description": "Project description"}
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

        // Cleanup JSON string if it contains markdown code blocks
        generatedText = generatedText.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(generatedText);

    } catch (error) {
        console.error('Gemini API Error:', error.response?.data || error.message);
        if (error instanceof SyntaxError) {
            console.error('Raw Generated Text:', response.data.candidates[0].content.parts[0].text);
        }
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

const chatWithAI = async (message, skill) => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        // Engineered Prompt for "Simple, Friendly, UI-ready" responses
        const promptText = `
        You are an expert, super friendly AI tutor helping a beginner student learn "${skill}".
        The student asks: "${message}"

        Guidelines:
        1. Keep it **simple and easy to understand** (ELI5 style).
        2. Use **analogies** or real-world examples whenever possible to explain concepts.
        3. Use **Markdown** formatting to make it look good (bold key terms, use bullet points for lists).
        4. Keep it concise (max 4-5 sentences unless a list is needed).
        5. If showing code, use proper code blocks.

        Return ONLY the formatted response text.
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

        return response.data.candidates[0].content.parts[0].text;

    } catch (error) {
        console.error('Gemini Chat Error:', error.response?.data || error.message);
        throw new Error('Failed to get chat response');
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

module.exports = { generateRoadmap, getExplanation, chatWithAI, generateStudySchedule };
