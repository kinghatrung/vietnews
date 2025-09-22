import { Router } from 'express';
import statusController from '../controllers/statusController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const statusRouter = Router();

// GET ALL STATUSES
statusRouter.get('/', statusController.getAllStatuses);

// GET STATUS BY ID
statusRouter.get('/:id', statusController.getStatusById);

// ADD STATUS
statusRouter.post(
  '/post',
  authMiddleware.isAuthorized,
  statusController.addStatus
);

export default statusRouter;
