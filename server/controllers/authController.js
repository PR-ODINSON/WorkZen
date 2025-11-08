const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { success, error } = require('../utils/response');

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return error(res, 'Missing fields', 400);

    const existing = await User.findOne({ email });
    if (existing) return error(res, 'Email already registered', 400);

    const usersCount = await User.countDocuments();
    const role = usersCount === 0 ? 'admin' : 'employee'; // first user is admin

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, passwordHash, role });
    return success(res, { message: 'User registered', user }, 201);
  } catch (err) {
    console.error(err);
    return error(res, err.message);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return error(res, 'Invalid credentials', 401);

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return error(res, 'Invalid credentials', 401);

    const payload = { id: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secretkey', { expiresIn: '7d' });

    return success(res, { message: 'Logged in', token, user });
  } catch (err) {
    console.error(err);
    return error(res, err.message);
  }
};

exports.logout = async (req, res) => {
  // client-side can simply remove token; endpoint provided for symmetry
  return success(res, { message: 'Logged out' });
};
