import { Router } from 'express';
import articleController from '../controllers/articleController.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import authMiddleware from '../middleware/authMiddleware.js';

const articleRouter = Router();

// GET ALL ARTICLES
articleRouter.get('/', articleController.getAllArticles);

// GET ARTICLE BY ID
articleRouter.get(
  '/:id',
  roleMiddleware.isNotUser,
  articleController.getArticleById
);

// GET ARTICLE BY ROLE
articleRouter.post('/get/by_role', articleController.getArticleByRole);

// ADD ARTICLE
articleRouter.post(
  '/post',
  authMiddleware.isAuthorized,
  roleMiddleware.isReporter,
  articleController.addArticle
);

// CHANGE STATUS
articleRouter.put(
  '/change_status/:id',
  authMiddleware.isAuthorized,
  articleController.changeStatusArticle
);

// CHECK CONTENT ARTICLE
articleRouter.post(
  '/check_content',
  authMiddleware.isAuthorized,
  articleController.checkContentArticle
);

// DELETE ARTICLE
articleRouter.delete(
  '/del/:id',
  authMiddleware.isAuthorized,
  // roleMiddleware.isAdminAndReporter,
  articleController.deleteArticle
);

// UPDATE ARTICLE
articleRouter.put(
  '/put/:id',
  authMiddleware.isAuthorized,
  // roleMiddleware.isEditorAndReporter,
  articleController.updateArticle
);

export default articleRouter;
