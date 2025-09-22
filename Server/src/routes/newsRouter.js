import { Router } from 'express';
import newsController from '../controllers/newsController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const newsRouter = Router();

// GET ALL NEWS
newsRouter.get('/', newsController.getAllNews);

// POST ALL NEWS
newsRouter.post('/post', newsController.postAllNews);

// GET NEWS BY ID
newsRouter.get('/:id', newsController.getNewsById);

// LIKE OR UNLIKE NEWS
newsRouter.post(
  '/:id/like',
  authMiddleware.isAuthorized,
  newsController.likeOrUnlikeNews
);

// SEARCH NEWS
newsRouter.get('/get/search', newsController.searchNews);

// POST NEWS BY ID FOR REPORTER
newsRouter.post(
  '/post/:id',
  authMiddleware.isAuthorized,
  newsController.postNewsForReporter
);

// DELETE NEWS
newsRouter.delete(
  '/:id',
  authMiddleware.isAuthorized,
  newsController.deleteNews
);

export default newsRouter;
