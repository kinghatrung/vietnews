import { Status } from '../models/Status.js';

const statusServices = {
  // GET ALL STATUSES
  getAllStatuses: async () => {
    try {
      const statuses = await Status.find();
      return statuses;
    } catch (err) {
      throw err;
    }
  },

  // GET STATUS BY ID
  getStatusById: async (statusId) => {
    try {
      const status = await Status.findById(statusId);
      if (!status) {
        throw new Error('Không tìm thấy trạng thái');
      }
    } catch (err) {
      throw err;
    }
  },

  // ADD STATUS
  addStatus: async (status_name) => {
    try {
      const newStatus = new Status({
        status_name: status_name,
      });
      const status = await newStatus.save();
      return status;
    } catch (err) {
      throw err;
    }
  },
};

export default statusServices;
