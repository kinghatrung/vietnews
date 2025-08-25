const jwt = require('jsonwebtoken');

const generateToken = async (userInfo, secretSignature, tokenLife) => {
  try {
    // Hàm sign() của jwt và thuật toán HS256
    return jwt.sign(userInfo, secretSignature, {
      algorithm: 'HS256',
      expiresIn: tokenLife,
    });
  } catch (err) {
    throw new Error(err);
  }
};

const verifyToken = async (token, secretSignature) => {
  try {
    // Hàm verify() của jwt
    return jwt.verify(token, secretSignature);
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = { generateToken, verifyToken };
