const router = require('express').Router();
const recommendController = require('../controllers/recommendController');
const authMiddleware = require('../middleware/authMiddleware');

// GET ALL RECOMMEND
router.get('/', recommendController.getAllRecommend);

// ADD RECOMMEND
router.post(
  '/post',
  authMiddleware.isAuthorized,
  recommendController.addRecommend
);

// ADD RECOMMEND TO CATEGORY
router.post(
  '/category/:id',
  authMiddleware.isAuthorized,
  recommendController.addRecommendToCategory
);

// DELETE NEWS
router.delete(
  '/:id',
  authMiddleware.isAuthorized,
  recommendController.deleteRecommend
);

module.exports = router;
