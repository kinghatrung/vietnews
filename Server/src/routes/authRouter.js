const router = require('express').Router();
const authController = require('../controllers/authController');
const sendOtpService = require('../services/sendOtpService');
const authMiddleware = require('../middleware/authMiddleware');

// LOGIN USER
router.post('/login', authController.userLogin);

// LOGIN WITH GOOGLE
router.post('/google', authController.userGoogleLogin);

// LOGIN WITH FACEBOOK
router.post('/facebook', authController.userFacebookLogin);

// REGISTER USER
router.post('/register', authController.userRegister);

// FORGOT PASSWORD
router.post('/forgot_pass', authController.userForgotPassword);

// SEND OTP
router.post('/send_otp/register', sendOtpService.sendOtpRegister);
router.post('/send_otp/forgot_pass', sendOtpService.sendOtpForgotPassword);
router.post(
  '/send_otp/new_email',
  authMiddleware.isAuthorized,
  sendOtpService.sendOtpUpdateEmail
);

// LOGOUT USER
router.delete('/logout', authController.userLogout);

// REFRESH TOKEN
router.put('/refresh', authController.requestRefreshToken);

module.exports = router;
