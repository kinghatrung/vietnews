import { Router } from 'express';
import sendOtpService from '../services/sendOtpService.js';
import authMiddleware from '../middleware/authMiddleware.js';
import authController from '../controllers/authController.js';

const authRouter = Router();

// LOGIN USER
authRouter.post('/login', authController.userLogin);

// LOGIN WITH GOOGLE
authRouter.post('/google', authController.userGoogleLogin);

// LOGIN WITH FACEBOOK
authRouter.post('/facebook', authController.userFacebookLogin);

// REGISTER USER
authRouter.post('/register', authController.userRegister);

// FORGOT PASSWORD
authRouter.post('/forgot_pass', authController.userForgotPassword);

// SEND OTP
authRouter.post('/send_otp/register', sendOtpService.sendOtpRegister);
authRouter.post('/send_otp/forgot_pass', sendOtpService.sendOtpForgotPassword);
authRouter.post(
  '/send_otp/new_email',
  authMiddleware.isAuthorized,
  sendOtpService.sendOtpUpdateEmail
);

// LOGOUT USER
authRouter.delete('/logout', authController.userLogout);

// REFRESH TOKEN
authRouter.put('/refresh', authController.requestRefreshToken);

export default authRouter;
