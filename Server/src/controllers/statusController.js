const statusServices = require('../services/statusServices');

const statusController = {
  // GET ALL STATUSES
  getAllStatuses: async (req, res) => {
    try {
      const statuses = await statusServices.getAllStatuses();
      res.status(200).json(statuses);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // GET STATUS BY ID
  getStatusById: async (req, res) => {
    try {
      const status = await statusServices.getStatusById(req.params.id);

      res.status(200).json(status);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // ADD STATUS
  addStatus: async (req, res) => {
    try {
      const { status_name } = req.body;
      await statusServices.addStatus(status_name);

      res.status(201).json({ message: 'Tạo trạng thái thành công' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = statusController;
