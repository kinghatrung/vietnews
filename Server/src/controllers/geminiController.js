const geminiServices = require('../services/geminiServices');

const geminiController = {
  chatBotGemini: async (req, res) => {
    try {
      const { question } = req.body;
      const result = await geminiServices.chatBotGemini(question);

      res.status(200).json(result);
    } catch (err) {
      throw err;
    }
  },
};

module.exports = geminiController;
