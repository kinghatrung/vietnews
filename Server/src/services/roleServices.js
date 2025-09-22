const { Role } = require('../models/Role');

const roleServices = {
  // GET ALL ROLE
  getAllRole: async () => {
    try {
      const roles = await Role.find();

      return roles;
    } catch (err) {
      throw err;
    }
  },

  // GET ROLE BY ID
  getRoleById: async (roleId) => {
    try {
      const role = await Role.findById(roleId);
      if (!role) {
        return res.status(404).json('Không tìm thấy vai trò');
      }

      return role;
    } catch (err) {
      throw err;
    }
  },

  // DELETE ROLE
  deleteRole: async (roleId) => {
    try {
      const role = await Role.findById(roleId);

      if (!role) {
        return res.status(404).json('Role not found');
      }
      await Role.findByIdAndDelete(roleId);

      return 'Xóa bài viết thành công';
    } catch (err) {
      return err;
    }
  },

  // UPDATE ROLE
  updateRole: async (idRole, role_name) => {
    try {
      const updatedRole = await Role.findByIdAndUpdate(
        idRole,
        {
          role_name: role_name,
        },
        { new: true }
      );
      if (!updatedRole) {
        throw new Error('Không tìm thấy vai trò cần cập nhật');
      }
      return updatedRole;
    } catch (err) {
      return err;
    }
  },

  // ADD ROLE
  createRole: async (role_name) => {
    try {
      const newRole = await new Role({
        role_name: role_name,
      });

      const saveRole = await newRole.save();

      return saveRole;
    } catch (err) {
      throw err;
    }
  },
};

module.exports = roleServices;
