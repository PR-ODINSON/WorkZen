const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');

const listUsers = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/workzen';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Find all users
    const users = await User.find({}, 'name email role status');
    
    console.log('\n📋 All Users in Database:');
    console.log('════════════════════════════════════════════════════════');
    
    if (users.length === 0) {
      console.log('No users found in database.');
    } else {
      users.forEach((user, index) => {
        console.log(`\n${index + 1}. ${user.name}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Status: ${user.status || 'Active'}`);
      });
    }
    
    console.log('\n════════════════════════════════════════════════════════\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

listUsers();
