const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/roadmap', require('./routes/roadmap'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/public', require('./routes/public'));
app.use('/api/career', require('./routes/career'));

const PORT = process.env.PORT || 5000;

const User = require('./models/UserModel');
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
    console.log('User schema paths:', Object.keys(User.schema.paths));
    console.log('User required paths:', User.schema.requiredPaths());
});
