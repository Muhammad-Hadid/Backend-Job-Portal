const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ status: 'fail', message: 'Invalid token' });
  }

  const token = authHeader.split(' ')[1];
  console.log('Token:', token); // ✅
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded:', decoded); // ✅
    req.user = decoded;
    next();
  } catch (error) {
    console.log('JWT Error:', error.message); // 🔍 add this
    return res.status(401).json({ status: 'fail', message: 'Invalid token' });
  }
};

const authorizeAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ 
      status: 'fail', 
      message: 'Access denied. Admin privileges required.' 
    });
  }
  next();
};

// For backwards compatibility
const authMiddleware = authenticate;

module.exports = { authenticate, authorizeAdmin, authMiddleware };
module.exports.default = authMiddleware;