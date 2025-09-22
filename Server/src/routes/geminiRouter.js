import { Router } from 'express';

import geminiController from '../controllers/geminiController.js';

const geminiRouter = Router();

geminiRouter.post('/chat', geminiController.chatBotGemini);

export default geminiRouter;
