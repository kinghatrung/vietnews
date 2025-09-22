const router = require("express").Router();
const uploadController = require("../controllers/uploadController");

router.post("/image_upload", uploadController.uploadImage);

module.exports = router;
