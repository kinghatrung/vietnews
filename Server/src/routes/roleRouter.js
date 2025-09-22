import { Router } from 'express';
import roleController from '../controllers/roleController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const roleRouter = Router();

// CREATE ROLE
roleRouter.post(
  '/createRole',
  authMiddleware.isAuthorized,
  roleController.createRole
);

// GET ALL ROLE
roleRouter.get('/', roleController.getAllRole);

// GET ROLE BY ID
roleRouter.get('/:id', roleController.getRoleById);

// DELETE ROLE
roleRouter.delete(
  '/del/:id',
  authMiddleware.isAuthorized,
  roleController.deleteRole
);

// UPDATE ROLE
roleRouter.put(
  '/update/:id',
  authMiddleware.isAuthorized,
  roleController.updateRole
);

export default roleRouter;
