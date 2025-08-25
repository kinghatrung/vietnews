const router = require('express').Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// ADD USER
router.post('/post', userController.postUser);

// GET USER
router.get('/:id', userController.getUser);

// GET ALL USER
router.get('/', userController.getAllUser);

// GET ALL USER (EDITORS)
router.get('/get/editors', userController.getAllEditors);

// GET ALL USER (EDITORS)
router.get('/get/reporters', userController.getAllReporters);

// GET ALL USER (ADMIN)
router.get('/get/admins', userController.getAllAdmin);

// GET SAVE NEWS
router.get('/:userId/saved-news', userController.getSavedNews);

// SAVE NEWS
router.post(
  '/:userId/toggle_save/:newsId',
  authMiddleware.isAuthorized,
  userController.toggleSaveNews
);

// SEARCH USERS
router.get('/get/search-user', userController.searchUser);

// BAN USER
router.post(
  '/ban-user/:id',
  authMiddleware.isAuthorized,
  userController.banUser
);

// UNBAN USER
router.put('/unban/:id', authMiddleware.isAuthorized, userController.unbanUser);

// UPDATE ROLE USER
router.put(
  '/role/:id',
  authMiddleware.isAuthorized,
  userController.updateRoleUser
);

// GET ALL USER (WITHOUT AUTH)
router.post('/without_auth', userController.getAllUsersWithoutSelf);

// UPDATE NORMAL INFO
router.put(
  '/put/nor/:id',
  authMiddleware.isAuthorized,
  userController.updateNormalInfo
);

// UPDATE PASSWORD
router.put(
  '/put/pass/:id',
  authMiddleware.isAuthorized,
  userController.updatePassword
);

// UPDATE EMAIL
router.put(
  '/put/email/:id',
  authMiddleware.isAuthorized,
  userController.updateEmail
);

// DELETE USER
router.delete(
  '/del/:id',
  authMiddleware.isAuthorized,
  userController.deleteUser
);

module.exports = router;
