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
	chat: {
		playerId?: string;
		message: string;
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
		const roomId = generateRandomRoomId();
		const name = 'Player 1';
		const newRoom: Room = {
			id: roomId,
			players: [{ id: socket.id, name }],
			chat: []
		};
		ROOMS.set(roomId, newRoom);
        socket.join(newRoom.id);
        console.log(`<${newRoom.id}>[${socket.id}] room created`);
        socket.emit('roomCreated', newRoom.id);
		io.to(socket.id).emit('roomCreated', newRoom.id);
		io.to(socket.id).emit('updatePlayersList', newRoom.players);
		io.to(roomId).emit('chatMessage', { message: name + ' created the room' });
    });

	socket.on('joinRoom', (roomId) => {
		const room = ROOMS.get(roomId);
		if (!room) {
			socket.emit('roomNotFound');
			console.log(`<${roomId}>[${socket.id}] room join failed`);
			return;
		}
		const name = 'Player '+ (room.players.length+1);
		room.players.push({ id: socket.id, name });
		ROOMS.set(socket.id, room);
		socket.join(roomId);
		console.log(`<${roomId}>[${socket.id}] room joined`);
		io.to(roomId).emit('roomJoined', {roomId, chat: room.chat});
		io.to(roomId).emit('updatePlayersList', room.players);
		io.to(roomId).emit('chatMessage', { message: name + ' joined the room' });
	});

    // Receive chat messages and emit to the same room
    socket.on('chatMessage', (data) => {
        const { roomId, message } = data;
        console.log(`<${roomId}>[${socket.id}] message: ${message}`);
        io.to(roomId).emit('chatMessage', { playerId: socket.id, message });

		//add chat message to room
		const room = ROOMS.get(roomId);
		if (!room) return;
		room.chat.push({ playerId: socket.id, message });
		ROOMS.set(roomId, room);
    });

	socket.on('addPiece', ({ roomId }) => {
		console.log(`<${roomId}>[${socket.id}] added piece`);

		io.to(roomId).emit('pieceAdded', { type: 'card', x: 0, y: 0 });
	});
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});