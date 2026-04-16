const mongoose = require('mongoose');
const User = require('./models/UserModel');
const connectDB = require('./config/db');
require('dotenv').config();

const makeMentor = async () => {
    try {
        await connectDB();

        const targetEmail = 'mentor@skillroute.ai';
        const targetPassword = 'password123';

        let user = await User.findOne({ email: targetEmail });
        if (!user) {
            console.log(`User with email ${targetEmail} not found. Creating new mentor user...`);
            user = new User({
                name: 'Elite Mentor',
                username: 'mentor_expert',
                email: targetEmail,
                password: targetPassword,
                role: 'mentor'
            });
            await user.save();
            console.log(`Created new mentor user: ${targetEmail}`);
        } else {
            user.role = 'mentor';
            user.password = targetPassword;
            await user.save();
            console.log(`Updated user ${targetEmail} to mentor role and reset password.`);
        }

        console.log('\n-----------------------------');
        console.log('Mentor Credentials:');
        console.log(`Email: ${targetEmail}`);
        console.log(`Password: ${targetPassword}`);
        console.log('-----------------------------\n');

    } catch (error) {
        console.error('Script error:', error);
    } finally {
        process.exit();
    }
};

makeMentor();
