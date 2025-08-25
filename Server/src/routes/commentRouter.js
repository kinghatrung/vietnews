const router = require('express').Router();
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middleware/authMiddleware');

// CREATE COMMENT
router.post(
  '/send',
  authMiddleware.isAuthorized,
  commentController.createComment
);

// GET ALL COMMENT
router.get('/', commentController.getPendingComments);

// DELETE COMMENT
router.delete(
  '/del/:id',
  authMiddleware.isAuthorized,
  commentController.deleteCommentPending
);

// GET COMMENT
router.get('/news/:newsId', commentController.getCommentByNews);

// APPROVE COMMENT
router.put(
  '/approve/:id',
  authMiddleware.isAuthorized,
  commentController.approveComment
);

module.exports = router;
