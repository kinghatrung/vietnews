const { User } = require('../models/User');
const { Role } = require('../models/Role');
const { Otp } = require('../models/Otp');
const { sendBanNotification } = require('../services/emailService');
const bcrypt = require('bcrypt');
const { Comment } = require('../models/Comment');

const userServices = {
  // ADD USER
  postUser: async (email, username, password, full_name, otp) => {
    try {
      const foundOtp = await Otp.findOne({ email });
      if (!foundOtp) {
        return res.status(400).json({
          message: 'Chưa gửi mã OTP hoặc mã đã hết hạn',
        });
      }
      if (foundOtp.otp !== otp) {
        return res.status(400).json({
          message: 'Mã OTP không đúng',
        });
      }

      // Băm mật khẩu
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(password, salt);
      const userRole = await Role.findOne({ role_name: 'user' });

      //  Tạo User mới
      const newUser = await new User({
        username: username,
        email: email,
        full_name: full_name,
        password: hashed,
        role: userRole._id,
        isActive: true,
        phone: null,
        address: null,
        birth_date: null,
        gender: null,
        avatar: null,
      });

      const user = await newUser.save();
      await Otp.deleteOne({ email });

      return { message: 'Thêm người dùng thành công', user };
    } catch (err) {
      throw err;
    }
  },

  // GET ALL USER
  getAllUser: async () => {
    try {
      const users = await User.find().populate('role', 'role_name');

      return users;
    } catch (err) {
      throw err;
    }
  },

  // BAN USER
  banUser: async (id, days, reason) => {
    try {
      const user = await User.findById(id);
      if (!user) throw new Error('Không tìm thấy người dùng');

      const banUntil = new Date();
      banUntil.setMinutes(banUntil.getMinutes() + parseFloat(days) * 1440);

      user.banReason = reason;
      user.banUntil = banUntil;
      user.isActive = false;
      await user.save();

      // Xóa các comment đang ở trạng thái chờ của user
      await Comment.deleteMany({ user: id, status_name: 'Chờ duyệt' });

      try {
        await sendBanNotification(
          user.email,
          user.full_name || user.username,
          banUntil,
          reason
        );
      } catch (err) {
        throw err;
      }

      return { message: 'Đã khóa tài khoản thành công', banUntil };
    } catch (err) {
      throw err;
    }
  },

  // SEARCH USER
  searchUser: async (q = '') => {
    try {
      const query = {};

      if (q) {
        query.$or = [{ full_name: { $regex: q, $options: 'i' } }];
      }

      const results = await User.find(query);

      return results;
    } catch (err) {
      throw err;
    }
  },

  // UPDATE ROLE USER
  updateRoleUser: async (id, role_name) => {
    try {
      const newRole = await Role.findOne({ role_name: role_name });
      if (!newRole) {
        throw new Error('Role không tồn tại');
      }

      const updatedUser = await User.findByIdAndUpdate(
        id,
        { $set: { role: newRole._id } },
        { new: true }
      ).populate('role');

      if (!updatedUser) {
        throw new Error('Không tìm thấy người dùng');
      }

      return { message: 'Cập nhật vai trò thành công', updatedUser };
    } catch (err) {
      throw err;
    }
  },

  // UNBAN USER
  unbanUser: async (userId) => {
    try {
      const user = await User.findById(userId);

      if (!user) throw new Error('Không tìm thấy người dùng');

      user.isActive = true;
      user.banReason = null;
      user.banUntil = null;

      await user.save();

      return { message: 'Tài khoản đã được mở khóa thành công' };
    } catch (error) {
      throw err;
    }
  },

  // GET ALL USER (EDITORS)
  getAllEditors: async () => {
    try {
      const editorRole = await Role.findOne({ role_name: 'editor' });
      if (!editorRole) {
        throw new Error('Role editor không tồn tại');
      }
      const editors = await User.find({ role: editorRole._id });

      return editors;
    } catch (err) {
      throw err;
    }
  },

  getAllReporters: async () => {
    try {
      const reporterRole = await Role.findOne({ role_name: 'reporter' });
      if (!reporterRole) {
        throw new Error('Role reporter không tồn tại');
      }
      const reporters = await User.find({ role: reporterRole._id });

      return reporters;
    } catch (err) {
      throw err;
    }
  },

  // GET ALL USER (ADMIN)
  getAllAdmin: async () => {
    try {
      const adminRole = await Role.findOne({ role_name: 'admin' });
      if (!adminRole) {
        throw new Error('Role admin không tồn tại');
      }
      const admins = await User.find({ role: adminRole._id });

      return admins;
    } catch (err) {
      throw err;
    }
  },

  // GET ALL USER (WITHOUT AUTH)
  getAllUsersWithoutSelf: async (
    _id,
    roleNames = [],
    startDate,
    endDate,
    searchKey,
    status
  ) => {
    try {
      let roleFilter = {};
      let dateFilter = {};
      let searchFilter = {};
      let statusFilter = {};

      // Lọc theo vai trò
      if (roleNames.length > 0) {
        const roles = await Role.find({ role_name: { $in: roleNames } }).select(
          '_id'
        );
        const roleIds = roles.map((r) => r._id);
        roleFilter.role = { $in: roleIds };
      }

      // Lọc theo ngày tham gia
      if (startDate && endDate) {
        dateFilter.createdAt = {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      }

      // Lọc theo từ khóa
      if (searchKey && searchKey.trim() !== '') {
        const regex = new RegExp(searchKey, 'i');

        searchFilter.$or = [
          { username: { $regex: regex } },
          { email: { $regex: regex } },
          { full_name: { $regex: regex } },
        ];
      }

      // Lọc theo trạng thái
      if (status === 'active') statusFilter.isActive = true;
      if (status === 'inactive') statusFilter.isActive = false;

      const users = await User.find({
        _id: { $ne: _id },
        ...roleFilter,
        ...dateFilter,
        ...searchFilter,
        ...statusFilter,
      }).populate('role birth_date');

      return users;
    } catch (err) {
      throw err;
    }
  },

  // GET USER
  getUser: async (userId) => {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('Người dùng không tồn tại');
      }
      return user;
    } catch (err) {
      throw err;
    }
  },

  // UPDATE USER
  updateNormalInfo: async (id, data) => {
    try {
      const { phone, address, birth_date, gender, avatar, full_name } = data;
      const updatedFields = {};

      if (
        full_name !== undefined &&
        full_name.trim() !== '' &&
        full_name !== ''
      )
        updatedFields.full_name = full_name.trim();
      if (phone !== undefined && phone.trim() !== '' && phone !== '')
        updatedFields.phone = phone.trim();
      if (address !== undefined && address.trim() !== '' && address !== '')
        updatedFields.address = address.trim();
      if (
        birth_date !== undefined &&
        birth_date.trim() !== '' &&
        birth_date !== ''
      )
        updatedFields.birth_date = birth_date.trim();
      if (gender !== undefined && gender.trim() !== '' && gender !== '')
        updatedFields.gender = gender.trim();
      if (avatar !== undefined && avatar.trim() !== '' && avatar !== '')
        updatedFields.avatar = avatar.trim();

      const updatedUser = await User.findByIdAndUpdate(
        id,
        { $set: updatedFields },
        { new: true }
      );

      return { message: 'Cập nhật thông tin thành công', updatedUser };
    } catch (err) {
      throw err;
    }
  },

  //   UPDATE EMAIL
  updateEmail: async (userId, email, otp, password) => {
    try {
      const user = await User.findById(userId);
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        throw new Error('Mật khẩu hiện tại không đúng');
      }

      const checkEmail = await User.findOne({ email });
      if (checkEmail) {
        throw new Error('Email đã tồn tại');
      }

      const foundOtp = await Otp.findOne({ email });
      if (!foundOtp) {
        throw new Error('Chưa gửi mã OTP hoặc mã đã hết hạn');
      }
      if (foundOtp.otp !== otp) {
        throw new Error('Mã OTP không đúng');
      }

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: { email } },
        { new: true }
      );

      await Otp.deleteOne({ email });

      return { message: 'Cập nhật email thành công', updatedUser };
    } catch (err) {
      throw err;
    }
  },

  // UPDATE PASSWORD
  updatePassword: async (userId, password, newPassword) => {
    try {
      const user = await User.findById(userId);
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error('Mật khẩu hiện tại không đúng');
      }

      const salt = await bcrypt.genSalt(10);
      const hashedNewPassword = await bcrypt.hash(newPassword, salt);

      user.password = hashedNewPassword;
      await user.save();

      return { message: 'Cập nhật mật khẩu thành công', isMatch: isMatch };
    } catch (err) {
      throw err;
    }
  },

  // SAVE NEWS
  toggleSaveNews: async (userId, newsId) => {
    try {
      const user = await User.findById(userId);
      if (!user) throw new Error('Không tìm thấy người dùng');

      const index = user.savedNews.findIndex((id) => id.toString() === newsId);

      let action = '';

      if (index > -1) {
        user.savedNews.splice(index, 1);
        action = 'unsaved';
      } else {
        user.savedNews.push(newsId);
        action = 'saved';
      }

      await user.save();
      return action;
    } catch (err) {
      throw err;
    }
  },

  // GET SAVE NEWS
  getSavedNews: async (userId) => {
    try {
      const user = await User.findById(userId).populate('savedNews');
      if (!user) throw new Error('Không tìm thấy người dùng');

      return user.savedNews;
    } catch (err) {
      throw err;
    }
  },

  //   DELETE USER
  deleteUser: async (userId) => {
    try {
      await User.findByIdAndDelete(userId);

      return { message: 'Xóa người dùng thành công' };
    } catch (err) {
      throw err;
    }
  },
};

module.exports = userServices;
