const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');

// Load env from the same directory
dotenv.config({ path: path.join(__dirname, '.env') });

const testGemini = async () => {
    const apiKey = process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL; // Should be gemini-2.5-flash based on recent edits

    console.log(`Testing with Model: ${model}`);
    console.log(`API Key (first 5 chars): ${apiKey ? apiKey.substring(0, 5) : 'MISSING'}...`);

    if (!apiKey) {
        console.error('ERROR: GEMINI_API_KEY is missing in .env');
        return;
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    try {
        const response = await axios.post(
            url,
            {
                contents: [{ parts: [{ text: "Say hello!" }] }]
            },
            {
                headers: { 'Content-Type': 'application/json' }
            }
        );

        console.log('\nSUCCESS! API responded:');
        console.log(response.data.candidates[0].content.parts[0].text);

    } catch (error) {
        console.error('\nERROR: API Call Failed');
        console.error('Status:', error.response?.status);
        console.error('Message:', JSON.stringify(error.response?.data, null, 2));
    }
};

testGemini();
