const router = require('express').Router();
const categoryController = require('../controllers/categoryController');
const roleMiddleware = require('../middleware/roleMiddleware');
const authMiddleware = require('../middleware/authMiddleware');

// ADD CATEGORY
router.post(
  '/new',
  authMiddleware.isAuthorized,
  categoryController.addCategory
);

// UPDATE CATEGORY
router.put(
  '/:id',
  authMiddleware.isAuthorized,
  categoryController.updateCategory
);

// GET ALL CATEGORIES
router.get('/', categoryController.getAllCategories);

// POST ALL CATEGORIES
router.post('/post', categoryController.postAllCategories);

// GET CATEGORY BY ID
router.get('/:id', categoryController.getCategoryById);

// DELETE CATEGORY
router.delete(
  '/:id',
  authMiddleware.isAuthorized,
  categoryController.deleteCategory
);

module.exports = router;
