const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const connectDB = require('./config/db');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

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
app.use('/api/mentor', require('./routes/mentor'));
app.use('/api/gamification', require('./routes/gamification'));
app.use('/api/community', require('./routes/community'));

// Socket Logic
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('join_room', (roomId) => {
        socket.join(roomId);
        console.log(`User joined room: ${roomId}`);
    });

    socket.on('send_message', (data) => {
        // Broadcast message to everyone else in the room
        socket.broadcast.to(data.roomId).emit('receive_message', data);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server with Socket.io started on port ${PORT}`);
});
