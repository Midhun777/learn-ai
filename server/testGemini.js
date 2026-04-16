const axios = require('axios');
require('dotenv').config();

const testGemini = async () => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        console.log(`Testing Gemini API with model: ${model}`);
        console.log(`URL: https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=HIDDEN`);

        const response = await axios.post(
            url,
            {
                contents: [{ parts: [{ text: "Generate a tiny JSON object with one field 'test': true. Return ONLY raw JSON." }] }],
                generationConfig: { responseMimeType: "application/json" }
            },
            {
                headers: { 'Content-Type': 'application/json' }
            }
        );

        console.log('Response Status:', response.status);
        console.log('Response Data:', JSON.stringify(response.data, null, 2));

        if (response.data.candidates && response.data.candidates[0].content.parts[0].text) {
            console.log('Generated Text:', response.data.candidates[0].content.parts[0].text);
        } else {
            console.log('No content in response candidates.');
        }

    } catch (error) {
        console.error('Gemini API Error:', error.response?.data || error.message);
    }
};

testGemini();
