const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

/**
 * Migration script to add loginId to existing users who don't have one
 * Run this script once: node scripts/addLoginIdToExistingUsers.js
 */

const generateLoginId = async (fullName, year, userId) => {
  const nameParts = fullName.trim().split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts[nameParts.length - 1] || '';
  
  // Get first 2 letters of each name (uppercase)
  const firstInitials = firstName.substring(0, 2).toUpperCase().padEnd(2, 'O');
  const lastInitials = lastName.substring(0, 2).toUpperCase().padEnd(2, 'O');
  
  // Company code (fixed for Odoo India)
  const companyCode = 'OI';
  
  // Count existing users for this year to get serial number
  const count = await User.countDocuments({
    joiningYear: year,
    loginId: { $exists: true },
    _id: { $ne: userId } // Exclude current user
  });
  
  const serialNumber = String(count + 1).padStart(4, '0');
  
  // Format: OIJODO20220001
  return `${companyCode}${firstInitials}${lastInitials}${year}${serialNumber}`;
};

const addLoginIds = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/workzen';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Find all users without loginId
    const usersWithoutLoginId = await User.find({ 
      $or: [
        { loginId: { $exists: false } },
        { loginId: null }
      ]
    });

    console.log(`Found ${usersWithoutLoginId.length} users without loginId`);

    if (usersWithoutLoginId.length === 0) {
      console.log('All users already have loginId. Nothing to update.');
      process.exit(0);
    }

    // Update each user
    for (const user of usersWithoutLoginId) {
      // Use createdAt year if joiningYear doesn't exist
      const year = user.joiningYear || new Date(user.createdAt).getFullYear();
      
      // Generate loginId
      const loginId = await generateLoginId(user.name, year, user._id);
      
      // Update user
      user.loginId = loginId;
      if (!user.joiningYear) {
        user.joiningYear = year;
      }
      
      await user.save();
      console.log(`✓ Updated user: ${user.name} (${user.email}) -> LoginID: ${loginId}`);
    }

    console.log('\n✅ Migration completed successfully!');
    console.log(`Updated ${usersWithoutLoginId.length} users with loginId`);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  }
};

// Run the migration
addLoginIds();
