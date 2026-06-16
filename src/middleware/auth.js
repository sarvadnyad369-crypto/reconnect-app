const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function auth(req, res, next) {
  try {
    const header = req.headers.authorization;
    const cookieToken = req.cookies?.token;

    let token = cookieToken;

    if (!token && header && header.startsWith('Bearer ')) {
      token = header.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Login required'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select('-passwordHash');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired login'
    });
  }
}

module.exports = auth;