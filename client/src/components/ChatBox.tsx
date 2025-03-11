import { useEffect, useState } from 'react';
import '../styles/ChatBox.css';
import { socket } from '../util/client';

interface ChatBoxProps {
	roomId: string | null;
	players: { [key: string]: string };
}

interface ChatMessage {
    playerId: string;
    message: string;
}


export default function ChatBox({ roomId, players }: ChatBoxProps) {

    const [chatLog, setChatLog] = useState<ChatMessage[]>([]);
   

	const id = socket.id || "";

    function sendMessage() {
        const input = document.querySelector('.ChatInput input') as HTMLInputElement;
        const message = input.value;
        input.value = '';
        socket.emit('chatMessage', { roomId, message });
    }

    // Listen for chat messages
    useEffect(() => {
        function onChatMessage(data: ChatMessage) {
            console.log('Chat message received:', data);
            setChatLog((chatLog) => [...chatLog, data]);
        }

		function onRoomJoined({chat}: {chat: ChatMessage[]}) {
			console.log('Got chat history', chat);
			setChatLog(chat);
		}

        socket.on('chatMessage', onChatMessage);
		socket.on('roomJoined', onRoomJoined);

        return () => {
            socket.off('chatMessage', onChatMessage);
			socket.off('roomJoined', onRoomJoined);
        };
    }, []);

    return (<div className="ChatBox">
        <h1>Chat</h1>
        <div className="ChatLog">
            {chatLog.map((chat, index) => (
                <div key={index}>
					{chat.playerId ? 
                    	<><strong>{players[chat.playerId] || 'Unknown'}:</strong> {chat.message}</>
					:
						<i>{chat.message}</i>
					}
                </div>
            ))}
        </div>
        <div className="ChatInput">
            <input type="text" />
            <button onClick={sendMessage}>Send</button>
        </div>
    </div>);
}