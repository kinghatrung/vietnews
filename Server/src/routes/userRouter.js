import { Router } from 'express';
import userController from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const userRouter = Router();

// ADD USER
userRouter.post('/post', userController.postUser);

// GET USER
userRouter.get('/:id', userController.getUser);

// GET ALL USER
userRouter.get('/', userController.getAllUser);

// GET ALL USER (EDITORS)
userRouter.get('/get/editors', userController.getAllEditors);

// GET ALL USER (EDITORS)
userRouter.get('/get/reporters', userController.getAllReporters);

// GET ALL USER (ADMIN)
userRouter.get('/get/admins', userController.getAllAdmin);

// GET SAVE NEWS
userRouter.get('/:userId/saved-news', userController.getSavedNews);

// SAVE NEWS
userRouter.post(
  '/:userId/toggle_save/:newsId',
  authMiddleware.isAuthorized,
  userController.toggleSaveNews
);

// SEARCH USERS
userRouter.get('/get/search-user', userController.searchUser);

// BAN USER
userRouter.post(
  '/ban-user/:id',
  authMiddleware.isAuthorized,
  userController.banUser
);

// UNBAN USER
userRouter.put(
  '/unban/:id',
  authMiddleware.isAuthorized,
  userController.unbanUser
);

// UPDATE ROLE USER
userRouter.put(
  '/role/:id',
  authMiddleware.isAuthorized,
  userController.updateRoleUser
);

// GET ALL USER (WITHOUT AUTH)
userRouter.post('/without_auth', userController.getAllUsersWithoutSelf);

// UPDATE NORMAL INFO
userRouter.put(
  '/put/nor/:id',
  authMiddleware.isAuthorized,
  userController.updateNormalInfo
);

// UPDATE PASSWORD
userRouter.put(
  '/put/pass/:id',
  authMiddleware.isAuthorized,
  userController.updatePassword
);

// UPDATE EMAIL
userRouter.put(
  '/put/email/:id',
  authMiddleware.isAuthorized,
  userController.updateEmail
);

// DELETE USER
userRouter.delete(
  '/del/:id',
  authMiddleware.isAuthorized,
  userController.deleteUser
);

export default userRouter;
