const ms = require('ms');
const authServices = require('../services/authServices');

const authController = {
  // REGISTER USER
  userRegister: async (req, res) => {
    try {
      const user = await authServices.userRegister(req.body);

      res.status(200).json({ message: 'Đăng ký thành công', user });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // LOGIN USER
  userLogin: async (req, res) => {
    try {
      const { username, password } = req.body;
      const { accessToken, refreshToken, userInfo, user } =
        await authServices.userLogin(username, password);

      //   Xử lý trường hợp trả về HTTP only cookie cho phía trình duyệt
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: ms('7 days'),
      });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: ms('7 days'),
      });

      res.status(200).json({
        ...userInfo,
        accessToken,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // USER FORGOT PASSWORD
  userForgotPassword: async (req, res) => {
    try {
      const result = await authServices.userForgotPassword(req.body);

      res.status(200).json({ message: 'Đổi mật khẩu thành công', result });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // REFRESH TOKEN
  requestRefreshToken: async (req, res) => {
    try {
      const refreshTokenFromCookie = req.cookies?.refreshToken;

      const { accessToken } = await authServices.requestRefreshToken(
        refreshTokenFromCookie
      );

      // Res lại cookie accessToken mới cho trường hợp sử dụng cookie
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: ms('7 days'),
      });

      res.status(200).json({ accessToken: accessToken });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // LOG OUT
  userLogout: async (req, res) => {
    try {
      await authServices.userLogout(res);
      res.status(200).json({ message: 'Đăng xuất thành công' });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // LOGIN WITH GOOGLE
  userGoogleLogin: async (req, res) => {
    try {
      const { tokenGoogle } = req.body;
      const { userInfo, accessToken, refreshToken } =
        await authServices.userGoogleLogin(tokenGoogle);

      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: ms('7 days'),
      });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: ms('7 days'),
      });

      res.status(200).json({
        ...userInfo,
        accessToken,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // LOGIN WITH FACEBOOK
  userFacebookLogin: async (req, res) => {
    try {
      const { tokenFacebook } = req.body;
      const { userInfo, accessToken, refreshToken } =
        await authServices.userFacebookLogin(tokenFacebook);

      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: ms('7 days'),
      });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: ms('7 days'),
      });

      res.status(200).json({
        ...userInfo,
        accessToken,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

module.exports = authController;
