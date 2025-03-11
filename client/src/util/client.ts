import { io, Socket } from 'socket.io-client';

export const socket = io('http://localhost:3000');

// export class Client {
//     private socket: Socket;
// 	public loaded: boolean;
// 	public sessionId: string;

//     constructor() {
// 		this.loaded = false;
// 		this.sessionId = "";
//          // Adjust the URL as needed
//         console.log("Client class instantiated.");

//         this.socket.on('connect', () => {
//             console.log('Connected to server');
// 			this.loaded = true;
// 			this.sessionId = "12345";
//         });

//         this.socket.on('disconnect', () => {
//             console.log('Disconnected from server');
//         });

// 		this.socket.on('error', (error: any) => {
// 			console.error(error);
// 		});

// 		this.createGameSession("12345");
//     }

//     createGameSession(sessionId: string) {
//         this.socket.emit('createGameSession', { sessionId }, (response: any) => {
//             console.log(response);
//         });
//     }

//     public joinGameSession(sessionId: string) {
//         this.socket.emit('joinGameSession', { sessionId }, (response: any) => {
//             console.log(response);
//         });
//     }

//     public updateGameState(sessionId: string, newState: any) {
//         this.socket.emit('updateGameState', { sessionId, newState }, (response: any) => {
//             console.log(response);
//         });
//     }

//     public getGameState(sessionId: string) {
//         this.socket.emit('getGameState', { sessionId }, (response: any) => {
//             console.log(response);
//         });
//     }
// }