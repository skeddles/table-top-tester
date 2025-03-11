import { useEffect, useState } from 'react';
import '../styles/Client.css';
import { socket } from '../util/client';

import ChatBox from '@/components/ChatBox';

interface ClientProps {

}


interface Player {
	id: string;
	name: string;
}

export default function Client({}: ClientProps) {

	const [connected, setConnected] = useState(false);
	const [roomId, setRoomId] = useState<null | string>(null);
	const [playerId, setPlayerId] = useState<null | any>(null);
	const [players, setPlayers] = useState<{ [key: string]: string }>({});

	useEffect(() => {
		function onConnect() {
			console.log('Connected to server');
			setConnected(true);
			setRoomId("12345");
			setPlayerId(socket.id);

			// if there is a room id in the URL, join that room
			const urlParams = new URLSearchParams(window.location.search);
			const roomId = urlParams.get('room');
			if (roomId)
				socket.emit('joinRoom', roomId);
			else
				socket.emit('createRoom');
		}

		function onDisconnect() {
			console.log('Disconnected from server');
			setConnected(false);
		}

		function onRoomCreated(roomId: string) {
			console.log('Room created:', roomId);
			setRoomId(roomId);
			// update the URL with the room id
			window.history.pushState({}, '', `?room=${roomId}`);
		}

		function onRoomJoined(roomId: string) {
			console.log('Room joined:', roomId);
			setRoomId(roomId);
		}

		function onRoomNotFound() {
			console.log('Room not found');
			alert('Room not found!');
		}

		function onUpdatePlayersList (players: Player[]) {
			console.log('Players list updated:', players);
            setPlayers(players.reduce((acc: { [key: string]: string }, player) => {
				acc[player.id] = player.name;
				return acc;
			}, {}));
		}

		socket.on('connect', onConnect);
		socket.on('disconnect', onDisconnect);
		socket.on('roomCreated', onRoomCreated);
		socket.on('roomJoined', onRoomJoined);
		socket.on('roomNotFound', onRoomNotFound);
		socket.on('updatePlayersList', onUpdatePlayersList);

		return () => {
			socket.off('connect', onConnect);
			socket.off('disconnect', onDisconnect);
			socket.off('roomCreated', onRoomCreated);
			socket.off('roomJoined', onRoomJoined);
			socket.off('roomNotFound', onRoomNotFound);
			socket.off('updatePlayersList', onUpdatePlayersList);
		};
	}, []);


	return (<div className="Client">
		{!connected && <div>
			<h1>Tabletop Playtester</h1>
			<p>Creating a new session...</p>
		</div>}

		{connected && <>
			<div className="Header">
				<h1>Tabletop Playtester</h1>
				<p>Session ID: {roomId}</p>
				<p>Player: {players[playerId]} ({playerId})</p>
				<p>Players: {Object.values(players).join(', ')}</p>
			</div>

			<div className="Body">

				<div className="Game">
					<p>Game content goes here...</p>
				</div>

				<div className="Sidebar">
					<ChatBox roomId={roomId} players={players}/>
				</div>

			</div>

		</>}
	</div>);
}