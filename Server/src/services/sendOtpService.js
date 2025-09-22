import {
  sendVerificationEmail,
  sendForgotPasswordEmail,
  sendUpdateEmail,
} from '../services/emailService.js';
import { Otp } from '../models/Otp.js';
import { User } from '../models/User.js';

const sendOtpService = {
  sendOtpRegister: async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email: req.body.email });

      if (user) {
        return res.status(400).json({ message: 'Email đã tồn tại' });
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      await Otp.findOneAndDelete({ email });

      await Otp.create({ email, otp });

      await sendVerificationEmail(email, otp);
      res
        .status(200)
        .json({ message: 'OTP đã được gửi đến email!', otp, email });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi gửi email' });
    }
  },

  sendOtpForgotPassword: async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({
          message:
            'Email không tồn tại trên hệ thống, vui lòng đăng ký tài khoản mới!',
        });
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      await Otp.findOneAndUpdate(
        { email },
        { otp },
        { upsert: true, new: true }
      );

      await sendForgotPasswordEmail(email, otp);

      res
        .status(200)
        .json({ message: 'OTP đã được gửi đến email!', otp, email });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  sendOtpUpdateEmail: async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({
          message:
            'Email đã tồn tại trên hệ thống, vui lòng sử dụng email mới!',
        });
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      await Otp.findOneAndUpdate(
        { email },
        { otp },
        { upsert: true, new: true }
      );

      await sendUpdateEmail(email, otp);

      res
        .status(200)
        .json({ message: 'OTP đã được gửi đến email!', otp, email });
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

export default sendOtpService;
