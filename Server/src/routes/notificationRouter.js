const router = require("express").Router();
const notificationController = require("../controllers/notificationController");

router.get("/:id", notificationController.getByUser);

module.exports = router;
