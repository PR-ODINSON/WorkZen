const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');

const addAdmin = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/workzen';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Hash the password
    const hashedPassword = await bcrypt.hash('123123', 10);

    // Create admin user
    const admin = new User({
      name: 'Admin Two',
      email: 'admin2@workzen.com',
      password: hashedPassword,
      role: 'Admin',
      status: 'Active'
    });

    await admin.save();
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin2@workzen.com');
    console.log('🔑 Password: 123123');

    process.exit(0);
  } catch (err) {
    if (err.code === 11000) {
      console.error('❌ User with this email already exists!');
    } else {
      console.error('❌ Error:', err.message);
    }
    process.exit(1);
  }
};

addAdmin();
