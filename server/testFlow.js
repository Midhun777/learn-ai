const axios = require('axios');

async function testFlow() {
  try {
    const email = `test${Date.now()}@example.com`;
    console.log("Registering:", email);
    const regRes = await axios.post('http://localhost:5000/api/auth/register', {
      name: 'Test User',
      username: email.split('@')[0],
      email,
      password: 'password123'
    });
    const token = regRes.data.token;
    console.log("Got token:", token.substring(0, 10) + "...");

    console.log("Generating roadmap...");
    const genRes = await axios.post('http://localhost:5000/api/roadmap/generate', {
      skill: 'React',
      skillLevel: 'beginner',
      deadlineDays: 30,
      hoursPerDay: 2,
      learningGoal: 'general knowledge'
    }, {
      headers: { 'x-auth-token': token }
    });
    console.log("Generated data keys:", Object.keys(genRes.data));

    console.log("Saving roadmap...");
    const saveRes = await axios.post('http://localhost:5000/api/roadmap/save', genRes.data, {
      headers: { 'x-auth-token': token }
    });
    console.log("Save successful! ID:", saveRes.data._id);

  } catch (err) {
    console.log("================ ERROR ================");
    console.log("Status:", err.response?.status);
    console.log("Data:", err.response?.data);
    console.log("Message:", err.message);
  }
}

testFlow();
