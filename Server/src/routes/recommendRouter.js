import { Router } from 'express';
import recommendController from '../controllers/recommendController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const recommendRouter = Router();

// GET ALL RECOMMEND
recommendRouter.get('/', recommendController.getAllRecommend);

// ADD RECOMMEND
recommendRouter.post(
  '/post',
  authMiddleware.isAuthorized,
  recommendController.addRecommend
);

// ADD RECOMMEND TO CATEGORY
recommendRouter.post(
  '/category/:id',
  authMiddleware.isAuthorized,
  recommendController.addRecommendToCategory
);

// DELETE NEWS
recommendRouter.delete(
  '/:id',
  authMiddleware.isAuthorized,
  recommendController.deleteRecommend
);

export default recommendRouter;
