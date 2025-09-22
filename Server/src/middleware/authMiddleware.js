import { generateToken, verifyToken } from '../providers/JwtProvider.js';

const authMiddleware = {
  isAuthorized: async (req, res, next) => {
    // C1: Lấy Token từ Cookie
    const accessTokenFromCookie = req.cookies?.accessToken;
    if (!accessTokenFromCookie) {
      res.status(401).json({ message: 'Không tìm thấy Token!' });
      return;
    }

    try {
      // B1: Giải mã token xem có hợp lệ hay không
      const accessTokenDecoded = await verifyToken(
        accessTokenFromCookie,
        process.env.JWT_ACCESS_TOKEN
      );

      /*   B2: Token hợp lệ thì cần lưu thông tin giải mã được 
      bào req.jwtDecoded để sử dụng cho các tầng cần xử lý ở
      phía sau */
      req.jwtDecoded = accessTokenDecoded;
      next();
    } catch (err) {
      if (err.message?.includes('jwt expired')) {
        res.status(410).json({ message: 'Need to refreshToken' });
        return;
      }
      res.status(401).json({ message: 'Hãy đăng nhập lại!' });
    }
  },
};

export default authMiddleware;
