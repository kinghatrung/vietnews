const router = require('express').Router();
const articleController = require('../controllers/articleController');
const roleMiddleware = require('../middleware/roleMiddleware');
const authMiddleware = require('../middleware/authMiddleware');

// GET ALL ARTICLES
router.get('/', articleController.getAllArticles);

// GET ARTICLE BY ID
router.get('/:id', roleMiddleware.isNotUser, articleController.getArticleById);

// GET ARTICLE BY ROLE
router.post('/get/by_role', articleController.getArticleByRole);

// ADD ARTICLE
router.post(
  '/post',
  authMiddleware.isAuthorized,
  roleMiddleware.isReporter,
  articleController.addArticle
);

// CHANGE STATUS
router.put(
  '/change_status/:id/',
  authMiddleware.isAuthorized,
  articleController.changeStatusArticle
);

// CHECK CONTENT ARTICLE
router.post(
  '/check_content',
  authMiddleware.isAuthorized,
  articleController.checkContentArticle
);

// DELETE ARTICLE
router.delete(
  '/del/:id',
  authMiddleware.isAuthorized,
  // roleMiddleware.isAdminAndReporter,
  articleController.deleteArticle
);

// UPDATE ARTICLE
router.put(
  '/put/:id',
  authMiddleware.isAuthorized,
  // roleMiddleware.isEditorAndReporter,
  articleController.updateArticle
);

module.exports = router;
