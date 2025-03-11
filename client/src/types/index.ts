export interface GamePiece {
    id: string;
    type: 'card' | 'dice' | 'counter' | 'marker';
    position: { x: number; y: number };
}

export interface Player {
    id: string;
    name: string;
    color: string;
}

export interface GameState {
    players: Player[];
    gamePieces: GamePiece[];
    turn: number;
    background: string;
}

export interface ChatMessage {
    playerId: string;
    message: string;
    timestamp: Date;
}