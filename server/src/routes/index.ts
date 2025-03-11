// filepath: y:\Projects\Websites\playtesttable\tabletop-playtester\server\src\routes\index.ts
import { Router } from 'express';
import IndexController from '../controllers';
import { Application, Request, Response } from 'express';

const router = Router();
const indexController = new IndexController();

export const setRoutes = (app: Application): void => {
    app.use('/api', router);

    router.get('/game-state', (req: Request, res: Response) => indexController.getGameState(req, res));
    router.post('/game-state', (req: Request, res: Response) => indexController.updateGameState(req, res));
    router.post('/game-session', (req: Request, res: Response) => indexController.createGameSession(req, res));
    router.post('/join-session', (req: Request, res: Response) => indexController.joinGameSession(req, res));
};