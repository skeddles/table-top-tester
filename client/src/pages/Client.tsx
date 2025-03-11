import { useEffect, useState } from 'react';
import '../styles/Client.css';
import { socket } from '../util/client';

import ChatBox from '@/components/ChatBox';

interface ClientProps {

}

export default function Client({}: ClientProps) {

	const [connected, setConnected] = useState(false);
	const [sessionId, setSessionId] = useState<null | string>(null);
	const [playerId, setPlayerId] = useState<null | any>(null);

	useEffect(() => {
		function onConnect() {
			console.log('Connected to server');
			setConnected(true);
			setSessionId("12345");
			setPlayerId(socket.id);

			socket.emit('createRoom');
		}

		function onDisconnect() {
			console.log('Disconnected from server');
			setConnected(false);
		}

		socket.on('connect', onConnect);
		socket.on('disconnect', onDisconnect);

		return () => {
			socket.off('connect', onConnect);
			socket.off('disconnect', onDisconnect);
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
				<p>Session ID: {sessionId}</p>
				<p>Player: {playerId}</p>
			</div>

			<div className="Body">

				<div className="Game">
					<p>Game content goes here...</p>
				</div>

				<div className="Sidebar">
					<ChatBox />
				</div>

			</div>

		</>}
	</div>);
}