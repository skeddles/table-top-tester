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

interface Room {
	id: string;
	players: {
		id: string;
		name: string;
	}[];
}

const ROOMS = new Map<string, Room>();

// Socket.io setup for real-time updates
io.on('connection', (socket) => {
    console.log(`[${socket.id}] connected`);

    // Handle socket events here

    socket.on('disconnect', () => {
        console.log(`[${socket.id}] disconnected`);
        // Remove player from the list
		const room = ROOMS.get(socket.id);
		if (!room) return;
		room.players = room.players.filter(player => player.id !== socket.id);
		ROOMS.set(socket.id, room);
    });

    // Join a room
    socket.on('connectToRoom', (roomId) => {
        socket.join(roomId);
        console.log(`User joined room: ${roomId}`);
    });

    // Create a room
    socket.on('createRoom', () => {
		const newRoom: Room = {
			id: generateRandomRoomId(),
			players: [{ id: socket.id, name: 'Player 1' }]
		};
		ROOMS.set(socket.id, newRoom);
        socket.join(newRoom.id);
        console.log(`<${newRoom.id}>[${socket.id}] room created`);
        socket.emit('roomCreated', newRoom.id);
		io.to(socket.id).emit('updatePlayersList', newRoom.players);
    });

    // Register player
    socket.on('registerPlayer', (name) => {
		const room = ROOMS.get(socket.id);
		if (!room) return;
        room.players.push({ id: socket.id, name: 'Player '+ room.players.length });
        console.log(`<${socket.id}>[${socket.id}] player registered`);

		// Send the player list to all players in the room
		io.to(socket.id).emit('updatePlayersList', room.players);
    });

    // Receive chat messages and emit to the same room
    socket.on('chatMessage', (data) => {
        const { roomId, message } = data;
        console.log(`<${roomId}>[${socket.id}] message: ${message}`);
        io.to(roomId).emit('chatMessage', { playerId: socket.id, message });
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});