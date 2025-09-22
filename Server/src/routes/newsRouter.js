const router = require('express').Router();
const newsController = require('../controllers/newsController');
const authMiddleware = require('../middleware/authMiddleware');

// GET ALL NEWS
router.get('/', newsController.getAllNews);

// POST ALL NEWS
router.post('/post', newsController.postAllNews);

// GET NEWS BY ID
router.get('/:id', newsController.getNewsById);

// LIKE OR UNLIKE NEWS
router.post(
  '/:id/like',
  authMiddleware.isAuthorized,
  newsController.likeOrUnlikeNews
);

// SEARCH NEWS
router.get('/get/search', newsController.searchNews);

// POST NEWS BY ID FOR REPORTER
router.post(
  '/post/:id',
  authMiddleware.isAuthorized,
  newsController.postNewsForReporter
);

// DELETE NEWS
router.delete('/:id', authMiddleware.isAuthorized, newsController.deleteNews);

module.exports = router;
