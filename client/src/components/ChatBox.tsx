import { useEffect, useState } from 'react';
import '../styles/ChatBox.css';
import { socket } from '../util/client';

interface ChatBoxProps {

}

interface ChatMessage {
    playerId: string;
    message: string;
}

interface Player {
	id: string;
	name: string;
}

export default function ChatBox({ }: ChatBoxProps) {

    const [chatLog, setChatLog] = useState<ChatMessage[]>([]);
    const [players, setPlayers] = useState<{ [key: string]: string }>({});
	const id = socket.id || "";

    function sendMessage() {
        const input = document.querySelector('.ChatInput input') as HTMLInputElement;
        const message = input.value;
        input.value = '';
        socket.emit('chatMessage', { roomId: 'someRoomId', message });
        setChatLog((chatLog) => [...chatLog, { playerId: id, message }]);
    }

    // Listen for chat messages
    useEffect(() => {
        function onChatMessage(data: ChatMessage) {
            console.log('Chat message received:', data);
            setChatLog((chatLog) => [...chatLog, data]);
        }

		function onUpdatePlayersList (players: Player[]) {
			console.log('Players list updated:', players);
            setPlayers(players.reduce((acc: { [key: string]: string }, player) => {
				acc[player.id] = player.name;
				return acc;
			}, {}));
		}

        socket.on('chatMessage', onChatMessage);
		socket.on('updatePlayersList', onUpdatePlayersList);

        return () => {
            socket.off('chatMessage', onChatMessage);
			socket.off('updatePlayersList', onUpdatePlayersList);
        };
    }, []);

    return (<div className="ChatBox">
        <h1>Chat</h1>
        <div className="ChatLog">
            {chatLog.map((chat, index) => (
                <div key={index}>
                    <strong>{players[chat.playerId] || 'Unknown'}:</strong> {chat.message}
                </div>
            ))}
        </div>
        <div className="ChatInput">
            <input type="text" />
            <button onClick={sendMessage}>Send</button>
        </div>
    </div>);
}