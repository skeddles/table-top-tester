// filepath: y:\Projects\Websites\playtesttable\tabletop-playtester\server\src\types\index.ts
export interface GameState {
    players: Player[];
    currentTurn: number;
    board: Board;
    chatMessages: ChatMessage[];
}

export interface Player {
    id: string;
    name: string;
    color: string;
}

export interface Board {
    pieces: GamePiece[];
    background: string;
}

export interface GamePiece {
    type: 'card' | 'dice' | 'counter' | 'marker';
    position: { x: number; y: number };
    properties: any; // Additional properties depending on the type
}

export interface ChatMessage {
    senderId: string;
    message: string;
    timestamp: Date;
}