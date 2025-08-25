const notificationServices = require('../services/notificationServices');

const notificationController = {
  getByUser: async (req, res) => {
    try {
      const notifications = await notificationServices.getByUser(req.params.id);
      res.json(notifications);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

module.exports = notificationController;
