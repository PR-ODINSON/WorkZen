const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT Token
exports.verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ success: false, message: 'Not authorized' });
  }
  
  const token = authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user ID to request
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Not authorized' });
  }
};

exports.adminOnly = async (req, res, next) => {
  try {
    if (!req.user) return res.status(401).json({ success:false, message:'Unauthorized' });
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'Admin') return res.status(403).json({ success:false, message:'Forbidden: Admins only' });
    next();
  } catch (err) {
    return res.status(500).json({ success:false, message:'Server error' });
  }
};
