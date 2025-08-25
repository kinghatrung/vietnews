const router = require('express').Router();
const statusController = require('../controllers/statusController');
const authMiddleware = require('../middleware/authMiddleware');

// GET ALL STATUSES
router.get('/', statusController.getAllStatuses);

// GET STATUS BY ID
router.get('/:id', statusController.getStatusById);

// ADD STATUS
router.post('/post', authMiddleware.isAuthorized, statusController.addStatus);

module.exports = router;
