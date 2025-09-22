const { generateToken, verifyToken } = require('../providers/JwtProvider');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { User } = require('../models/User');
const { Role } = require('../models/Role');
const { Otp } = require('../models/Otp');

const authServices = {
  // REGISTER USER
  userRegister: async (email, username, password, full_name, otp) => {
    try {
      // Kiểm tra mã Otp
      const foundOtp = await Otp.findOne({ email });
      if (!foundOtp) {
        throw new Error('Chưa gửi mã OTP hoặc mã đã hết hạn');
      }
      if (foundOtp.otp !== otp) {
        throw new Error('Mã OTP không đúng');
      }

      // Băm mật khẩu
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(password, salt);

      const userRole = await Role.findOne({ role_name: 'user' });
      if (!userRole) {
        throw new Error("Không tìm thấy vai trò 'user'");
      }

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

      //   Lưu vào database
      const savedUser = await newUser.save();

      await Otp.deleteOne({ email });
      return savedUser;
    } catch (err) {
      throw err;
    }
  },

  // LOGIN USER
  userLogin: async (username, password) => {
    try {
      const user = await User.findOne({ username: username }).populate(
        'role',
        'role_name'
      );

      if (!user) {
        throw { message: 'Người dùng không tồn tại' };
      }

      if (user.banUntil && new Date(user.banUntil) > new Date()) {
        throw {
          status: 403,
          message: `Tài khoản đã bị khóa đến ${new Date(user.banUntil).toLocaleString()}`,
          reason: user.banReason || 'Không rõ lý do',
        };
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        throw { status: 400, message: 'Mật khẩu không chính xác' };
      }

      const { password: _, ...userInfo } = user._doc;

      if (userInfo && validPassword) {
        const accessToken = await generateToken(
          userInfo,
          process.env.JWT_ACCESS_TOKEN,
          '1h'
        );

        const refreshToken = await generateToken(
          userInfo,
          process.env.JWT_REFRESH_TOKEN,
          '7 days'
        );

        return {
          user,
          userInfo,
          accessToken,
          refreshToken,
        };
      }
    } catch (err) {
      throw err;
    }
  },

  // REFRESH TOKEN
  requestRefreshToken: async (refreshTokenFromCookie) => {
    try {
      if (!refreshTokenFromCookie) throw new Error('Bạn chưa đăng nhập');

      const refreshTokenDecoded = await verifyToken(
        refreshTokenFromCookie,
        process.env.JWT_REFRESH_TOKEN
      );

      const user = await User.findOne({ _id: refreshTokenDecoded._id });

      const { password, ...userInfo } = user._doc;

      const newAccessToken = await generateToken(
        userInfo,
        process.env.JWT_ACCESS_TOKEN,
        '1h'
      );

      return { accessToken: newAccessToken };
    } catch (err) {
      throw err;
    }
  },

  // USER FORGOT PASSWORD
  userForgotPassword: async (req, res) => {
    try {
      const { email, password, otp } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        res.status(404).json({ message: 'Email không tồn tại' });
      }

      // Kiểm tra mã Otp
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

      const salt = await bcrypt.genSalt(10);
      const hashedNewPassword = await bcrypt.hash(password, salt);
      user.password = hashedNewPassword;
      await user.save();

      await Otp.deleteOne({ email });

      res.status(500).json({ message: 'Đổi mật khẩu thành công' });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // USER FORGOT PASSWORD
  userForgotPassword: async ({ email, password, otp }) => {
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        throw { status: 404, message: 'Email không tồn tại' };
      }

      // Kiểm tra mã Otp
      const foundOtp = await Otp.findOne({ email: email });
      if (!foundOtp) {
        throw { status: 400, message: 'Chưa gửi mã OTP hoặc mã đã hết hạn' };
      }

      if (foundOtp.otp !== otp) {
        throw { status: 400, message: 'Mã OTP không đúng' };
      }

      const salt = await bcrypt.genSalt(10);
      const hashedNewPassword = await bcrypt.hash(password, salt);

      user.password = hashedNewPassword;
      await user.save();

      await Otp.deleteOne({ email });

      return { message: 'Đổi mật khẩu thành công' };
    } catch (err) {
      throw err;
    }
  },

  // LOG OUT
  userLogout: async (res) => {
    try {
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');

      return { message: 'Đăng xuất thành công' };
    } catch (err) {
      throw err;
    }
  },

  // LOGIN WITH GOOGLE
  userGoogleLogin: async (tokenGoogle) => {
    try {
      const dataUserGoogleDecoded = jwt.decode(tokenGoogle);
      let user = await User.findOne({
        email: dataUserGoogleDecoded.email,
      }).populate('role', 'role_name');

      if (!user) {
        const userRole = await Role.findOne({ role_name: 'user' });
        const newUser = await new User({
          username: dataUserGoogleDecoded.email,
          email: dataUserGoogleDecoded.email,
          full_name: dataUserGoogleDecoded.name,
          password: null,
          role: userRole._id,
          isActive: true,
          phone: null,
          address: null,
          birth_date: null,
          gender: null,
          avatar: dataUserGoogleDecoded.picture,
        });
        user = await newUser.save();
      }

      if (user.banUntil && new Date(user.banUntil) > new Date()) {
        return {
          error: true,
          status: 403,
          message: `Tài khoản của bạn đang bị khóa đến ${new Date(user.banUntil).toLocaleString()}. Lý do: ${user.banReason || 'Không có lý do'}`,
        };
      }

      const { password, ...userInfo } = user._doc;

      const accessToken = await generateToken(
        userInfo,
        process.env.JWT_ACCESS_TOKEN,
        '1h'
      );

      const refreshToken = await generateToken(
        userInfo,
        process.env.JWT_REFRESH_TOKEN,
        '7 days'
      );

      return {
        userInfo,
        accessToken,
        refreshToken,
      };
    } catch (err) {
      throw err;
    }
  },

  // LOGIN WITH FACEBOOK
  userFacebookLogin: async (tokenFacebook) => {
    try {
      const response = await axios.get(
        `https://graph.facebook.com/me?access_token=${tokenFacebook}&fields=id,name,email,picture`
      );
      const { email, picture, name } = response.data;

      let user = await User.findOne({ email: email }).populate(
        'role',
        'role_name'
      );

      if (!user) {
        const userRole = await Role.findOne({ role_name: 'user' });
        const newUser = await new User({
          username: email,
          email: email,
          full_name: name,
          password: null,
          role: userRole._id,
          isActive: true,
          phone: null,
          address: null,
          birth_date: null,
          gender: null,
          avatar: picture.data.url,
        });
        user = await newUser.save();
      }

      if (user.banUntil && new Date(user.banUntil) > new Date()) {
        return {
          banned: true,
          banMessage: `Tài khoản của bạn đang bị khóa đến ${new Date(user.banUntil).toLocaleString()}. Lý do: ${user.banReason || 'Không có lý do'}`,
        };
      }

      const { password, ...userInfo } = user._doc;

      const accessToken = await generateToken(
        userInfo,
        process.env.JWT_ACCESS_TOKEN,
        '1h'
      );

      const refreshToken = await generateToken(
        userInfo,
        process.env.JWT_REFRESH_TOKEN,
        '7 days'
      );

      return {
        userInfo,
        accessToken,
        refreshToken,
      };
    } catch (err) {
      throw err;
    }
  },
};

module.exports = authServices;
