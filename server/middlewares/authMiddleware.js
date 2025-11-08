const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ success:false, message:'No token provided' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success:false, message:'Invalid token' });
  }
};

exports.adminOnly = async (req, res, next) => {
  try {
    if (!req.user) return res.status(401).json({ success:false, message:'Unauthorized' });
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'admin') return res.status(403).json({ success:false, message:'Forbidden: Admins only' });
    next();
  } catch (err) {
    return res.status(500).json({ success:false, message:'Server error' });
  }
};
