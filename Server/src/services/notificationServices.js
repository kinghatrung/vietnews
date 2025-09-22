import { Notification } from '../models/Notification.js';

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

export default notificationServices;
