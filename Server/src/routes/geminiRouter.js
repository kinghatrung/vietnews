const router = require("express").Router();
const geminiController = require("../controllers/geminiController");

router.post("/chat", geminiController.chatBotGemini);

module.exports = router;
