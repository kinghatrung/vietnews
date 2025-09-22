import { Router } from 'express';
import commentController from '../controllers/commentController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const commentRouter = Router();

// CREATE COMMENT
commentRouter.post(
  '/send',
  authMiddleware.isAuthorized,
  commentController.createComment
);

// GET ALL COMMENT
commentRouter.get('/', commentController.getPendingComments);

// DELETE COMMENT
commentRouter.delete(
  '/del/:id',
  authMiddleware.isAuthorized,
  commentController.deleteCommentPending
);

// GET COMMENT
commentRouter.get('/news/:newsId', commentController.getCommentByNews);

// APPROVE COMMENT
commentRouter.put(
  '/approve/:id',
  authMiddleware.isAuthorized,
  commentController.approveComment
);

export default commentRouter;
