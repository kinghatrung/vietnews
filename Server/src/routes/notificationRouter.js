import { Router } from 'express';
import notificationController from '../controllers/notificationController.js';

const notificationRouter = Router();

notificationRouter.get('/:id', notificationController.getByUser);

export default notificationRouter;
