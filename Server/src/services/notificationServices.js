const { Notification } = require('../models/Notification');

const notificationServices = {
  getByUser: async (userId) => {
    try {
      const notifications = await Notification.find({
        recipient: userId,
      }).sort({ createdAt: -1 });

      return notifications;
    } catch (err) {
      throw err;
    }
  },
};

module.exports = notificationServices;
