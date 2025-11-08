const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dept: { type: String },
  designation: { type: String },
  salary: { type: Number },
  joiningDate: { type: Date },
  phone: { type: String },
  address: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
