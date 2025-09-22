const router = require('express').Router();
const roleController = require('../controllers/roleController');
const authMiddleware = require('../middleware/authMiddleware');

// CREATE ROLE
router.post(
  '/createRole',
  authMiddleware.isAuthorized,
  roleController.createRole
);

// GET ALL ROLE
router.get('/', roleController.getAllRole);

// GET ROLE BY ID
router.get('/:id', roleController.getRoleById);

// DELETE ROLE
router.delete(
  '/del/:id',
  authMiddleware.isAuthorized,
  roleController.deleteRole
);

// UPDATE ROLE
router.put(
  '/update/:id',
  authMiddleware.isAuthorized,
  roleController.updateRole
);

module.exports = router;
