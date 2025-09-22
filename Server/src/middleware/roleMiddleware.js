import jwt from 'jsonwebtoken';

const roleMiddleware = {
  isAdminAndReporter: async (req, res, next) => {
    try {
      const accessTokenFromCookie = req.cookies?.accessToken;
      if (!accessTokenFromCookie) {
        res.status(401).json({ message: 'Không tìm thấy Token!' });
        return;
      }
      const dataUserDecoded = jwt.decode(accessTokenFromCookie);
      const roleUser = dataUserDecoded.role.role_name;

      if (roleUser !== 'reporter' || roleUser !== 'admin') {
        res.status(401).json({ message: 'Bạn không đủ quyền!' });
        return;
      }
      next();
    } catch (err) {
      res.status(401).json(err);
    }
  },
  isEditorAndReporter: async (req, res, next) => {
    try {
      const accessTokenFromCookie = req.cookies?.accessToken;
      if (!accessTokenFromCookie) {
        res.status(401).json({ message: 'Không tìm thấy Token!' });
        return;
      }
      const dataUserDecoded = jwt.decode(accessTokenFromCookie);
      const roleUser = dataUserDecoded.role.role_name;

      if (roleUser !== 'reporter' || roleUser !== 'editor') {
        res.status(401).json({ message: 'Bạn không đủ quyền!' });
        return;
      }
      next();
    } catch (err) {
      res.status(401).json(err);
    }
  },
  isReporter: async (req, res, next) => {
    try {
      const accessTokenFromCookie = req.cookies?.accessToken;
      if (!accessTokenFromCookie) {
        res.status(401).json({ message: 'Không tìm thấy Token!' });
        return;
      }
      const dataUserDecoded = jwt.decode(accessTokenFromCookie);
      const roleUser = dataUserDecoded.role.role_name;

      if (roleUser !== 'reporter') {
        res.status(401).json({ message: 'Bạn không đủ quyền!' });
        return;
      }
      next();
    } catch (err) {
      res.status(401).json(err);
    }
  },
  isNotUser: async (req, res, next) => {
    try {
      const accessTokenFromCookie = req.cookies?.accessToken;
      if (!accessTokenFromCookie) {
        res.status(401).json({ message: 'Không tìm thấy Token!' });
        return;
      }
      const dataUserDecoded = jwt.decode(accessTokenFromCookie);
      const roleUser = dataUserDecoded.role.role_name;

      if (roleUser === 'user') {
        res.status(401).json({ message: 'Bạn không đủ quyền!' });
        return;
      }
      next();
    } catch (err) {
      res.status(401).json(err);
    }
  },
  isAdmin: async (req, res, next) => {
    try {
      const accessTokenFromCookie = req.cookies?.accessToken;
      if (!accessTokenFromCookie) {
        res.status(401).json({ message: 'Không tìm thấy Token!' });
        return;
      }
      const dataUserDecoded = jwt.decode(accessTokenFromCookie);
      const roleUser = dataUserDecoded.role.role_name;

      if (roleUser === 'user') {
        res.status(401).json({ message: 'Bạn không đủ quyền!' });
        return;
      }
      next();
    } catch (err) {
      res.status(401).json(err);
    }
  },
};

export default roleMiddleware;
