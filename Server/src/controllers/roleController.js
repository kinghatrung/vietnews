const roleServices = require('../services/roleServices');

const roleController = {
  // GET ALL ROLE
  getAllRole: async (req, res) => {
    try {
      const roles = await roleServices.getAllRole();

      res.status(200).json(roles);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // GET ROLE BY ID
  getRoleById: async (req, res) => {
    try {
      const role = await roleServices.getRoleById(req.params.id);

      res.status(200).json(role);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // DELETE ROLE
  deleteRole: async (req, res) => {
    try {
      await roleServices.deleteRole(req.params.id);

      res.status(200).json('Xóa vai trò thành công');
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // UPDATE ROLE
  updateRole: async (req, res) => {
    try {
      const role = await roleServices.updateRole(
        req.params.id,
        req.body.role_name
      );
      res.status(200).json(role);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // ADD ROLE
  createRole: async (req, res) => {
    try {
      const role = await roleServices.createRole(req.body.role_name);

      res.status(200).json(role);
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = roleController;
