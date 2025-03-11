import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { setRoutes } from './routes';
import { json, urlencoded } from 'body-parser';
import cors from 'cors';
import { generateRandomRoomId } from './utilities/generate-random-room-id';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3344", // Adjust the origin as needed
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

// Set up routes
setRoutes(app);

// Socket.io setup for real-time updates
io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle socket events here

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    // Join a room
    socket.on('connectToRoom', (roomId) => {
        socket.join(roomId);
        console.log(`User joined room: ${roomId}`);
    });

    // Create a room
    socket.on('createRoom', () => {
        const roomId = generateRandomRoomId();
        socket.join(roomId);
        console.log(`Room created and user joined room: ${roomId}`);
        socket.emit('roomCreated', roomId);
    });

    // Receive chat messages and emit to the same room
    socket.on('chatMessage', (data) => {
        const { roomId, message } = data;
        console.log(`Chat message received in room ${roomId}: ${message}`);
        io.to(roomId).emit('chatMessage', message);
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});