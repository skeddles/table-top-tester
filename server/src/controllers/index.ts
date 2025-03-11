import { Request, Response } from 'express';

class IndexController {
    private gameState: any = {}; // Placeholder for game state storage
    private gameSessions: any = {}; // Placeholder for game sessions storage

    // Method to get the current game state
    public getGameState(req: Request, res: Response) {
        const sessionId  = String(req.query.sessionId);
		if (!sessionId) return;
        if (this.gameSessions[sessionId]) {
            res.json({ gameState: this.gameSessions[sessionId].state });
        } else {
            res.status(404).json({ message: "Game session not found." });
        }
    }

    // Method to update the game state
    public updateGameState(req: Request, res: Response) {
        const { sessionId } = req.body;
        const { newState } = req.body;
        if (this.gameSessions[sessionId]) {
            this.gameSessions[sessionId].state = newState;
            res.json({ message: "Game state updated successfully." });
        } else {
            res.status(404).json({ message: "Game session not found." });
        }
    }

    // Method to create a new game session
    public createGameSession(req: Request, res: Response) {
        const { sessionId } = req.body;
        if (!this.gameSessions[sessionId]) {
            this.gameSessions[sessionId] = { state: {} }; // Initialize with empty state
            res.json({ message: "New game session created successfully.", sessionId });
        } else {
            res.status(400).json({ message: "Game session already exists." });
        }
    }

    // Method to join an existing game session
    public joinGameSession(req: Request, res: Response) {
        const { sessionId } = req.body;
        if (this.gameSessions[sessionId]) {
            res.json({ message: "Joined game session successfully.", sessionId });
        } else {
            res.status(404).json({ message: "Game session not found." });
        }
    }

	//Method to receive chat messages
	public chatMessage(req: Request, res: Response) {
		const { sessionId } = req.body;
		const { message } = req.body;
		if (this.gameSessions[sessionId]) {
			// Do something with the chat message
			res.json({ message: "Chat message received." });
		} else {
			res.status(404).json({ message: "Game session not found." });
		}
	}
}

export default IndexController;