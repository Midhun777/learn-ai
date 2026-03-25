const mongoose = require('mongoose');
const User = require('./models/UserModel');
const connectDB = require('./config/db');
require('dotenv').config();

const makeAdmin = async () => {
    try {
        await connectDB();

        // Find the first user or create a specific script
        // Let's find your user by email or username
        // Update this email to your actual login email to make yourself admin
        const targetEmail = 'admin@learn';
        const targetPassword = '12341234';

        let user = await User.findOne({ email: targetEmail });
        if (!user) {
            console.log(`User with email ${targetEmail} not found. Creating new admin user...`);
            user = new User({
                name: 'Administrator',
                username: 'admin',
                email: targetEmail,
                password: targetPassword,
                role: 'admin'
            });
            await user.save();
            console.log(`Created new admin user: ${targetEmail}`);
        } else {
            user.role = 'admin';
            user.password = targetPassword; // Update password as requested
            await user.save();
            console.log(`Updated user ${targetEmail} to admin role and reset password.`);
        }

    } catch (error) {
        console.error('Script error:', error);
    } finally {
        process.exit();
    }
};

makeAdmin();
