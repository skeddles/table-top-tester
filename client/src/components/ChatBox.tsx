import { useEffect, useState } from 'react';
import '../styles/ChatBox.css';
import { socket } from '../util/client';

interface ChatBoxProps {

}

export default function ChatBox({}: ChatBoxProps) {

	const [chatLog, setChatLog] = useState<string[]>([]);

	function sendMessage() {
		const input = document.querySelector('.ChatInput input') as HTMLInputElement;
		const message = input.value;
		input.value = '';
		socket.emit('chatMessage', message);
		setChatLog((chatLog) => [...chatLog, message]);
	}

	// Listen for chat messages
	useEffect(() => {
		function onChatMessage(message: string) {
			console.log('Chat message received:', message);
			setChatLog((chatLog) => [...chatLog, message]);
		}

		socket.on('chatMessage', onChatMessage);

		return () => {
			socket.off('chatMessage', onChatMessage);
		};
	}, []);

	return (<div className="ChatBox">
		<h1>Chat</h1>
		<div className="ChatLog">
			{chatLog.map((message, index) => <div key={index}>{message}</div>)}
		</div>
		<div className="ChatInput">
			<input type="text" />
			<button onClick={sendMessage}>Send</button>
		</div>
	</div>);
}