const userServices = require('../services/userServices');

const userController = {
  // ADD USER
  postUser: async (req, res) => {
    try {
      const { email, username, password, full_name, otp } = req.body;

      const user = await userServices.postUser(
        email,
        username,
        password,
        full_name,
        otp
      );

      res.status(200).json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // GET ALL USER
  getAllUser: async (req, res) => {
    try {
      const users = await userServices.getAllUser();

      res.status(200).json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // BAN USER
  banUser: async (req, res) => {
    try {
      const { id } = req.params;
      const { days, reason } = req.body;

      const result = await userServices.banUser(id, days, reason);

      return res.status(200).json(result);
    } catch (err) {
      console.error('Lỗi khóa tài khoản:', err);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // UPDATE ROLE USER
  updateRoleUser: async (req, res) => {
    try {
      const { id } = req.params;
      const { role_name } = req.body;

      const result = await userServices.updateRoleUser(id, role_name);

      res.status(200).json(result);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // UNBAN USER
  unbanUser: async (req, res) => {
    try {
      const userId = req.params.id;
      const result = await userServices.unbanUser(userId);

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },

  // SEARCH USERS
  searchUser: async (req, res) => {
    try {
      const { q = '' } = req.query;
      const results = await userServices.searchUser(q);

      res.status(200).json({ results });
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // GET ALL USER (EDITORS)
  getAllEditors: async (req, res) => {
    try {
      const editors = await userServices.getAllEditors();

      res.status(200).json(editors);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // GET ALL USER (REPORTERS)
  getAllReporters: async (req, res) => {
    try {
      const reporters = await userServices.getAllReporters();

      res.status(200).json({ reporters });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // GET ALL USER (ADMIN)
  getAllAdmin: async (req, res) => {
    try {
      const admins = await userServices.getAllAdmin();

      res.status(200).json(admins);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // GET ALL USER (WITHOUT AUTH)
  getAllUsersWithoutSelf: async (req, res) => {
    try {
      const {
        _id,
        roles = [],
        startDate,
        endDate,
        searchKey,
        status,
      } = req.body;

      const users = await userServices.getAllUsersWithoutSelf(
        _id,
        roles,
        startDate,
        endDate,
        searchKey,
        status
      );

      res.status(200).json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // GET USER
  getUser: async (req, res) => {
    try {
      const user = await userServices.getUser(req.params.id);

      res.status(200).json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // UPDATE USER
  updateNormalInfo: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await userServices.updateNormalInfo(id, req.body);

      res.status(200).json(result);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  updateEmail: async (req, res) => {
    try {
      const { email, otp, password } = req.body;
      const userId = req.params.id;

      const result = await userServices.updateEmail(
        userId,
        email,
        otp,
        password
      );

      res.status(200).json(result);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  updatePassword: async (req, res) => {
    try {
      const { password, newPassword } = req.body;
      const userId = req.params.id;

      const result = await userServices.updatePassword(
        userId,
        password,
        newPassword
      );

      res.status(200).json(result);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // SAVE NEWS
  toggleSaveNews: async (req, res) => {
    try {
      const { userId, newsId } = req.params;

      const action = await userServices.toggleSaveNews(userId, newsId);

      res.status(200).json({ message: `News ${action} successfully`, action });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // GET SAVE NEWS
  getSavedNews: async (req, res) => {
    try {
      const result = await userServices.getSavedNews(req.params.userId);

      res.status(200).json(result);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //   DELETE USER
  deleteUser: async (req, res) => {
    try {
      const result = await userServices.deleteUser(req.params.id);
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

module.exports = userController;
