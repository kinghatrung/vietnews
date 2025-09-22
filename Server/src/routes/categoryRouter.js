import { Router } from 'express';
import categoryController from '../controllers/categoryController.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import authMiddleware from '../middleware/authMiddleware.js';

const categoryRouter = Router();

// ADD CATEGORY
categoryRouter.post(
  '/new',
  authMiddleware.isAuthorized,
  categoryController.addCategory
);

// UPDATE CATEGORY
categoryRouter.put(
  '/:id',
  authMiddleware.isAuthorized,
  categoryController.updateCategory
);

// GET ALL CATEGORIES
categoryRouter.get('/', categoryController.getAllCategories);

// POST ALL CATEGORIES
categoryRouter.post('/post', categoryController.postAllCategories);

// GET CATEGORY BY ID
categoryRouter.get('/:id', categoryController.getCategoryById);

// DELETE CATEGORY
categoryRouter.delete(
  '/:id',
  authMiddleware.isAuthorized,
  categoryController.deleteCategory
);

export default categoryRouter;
