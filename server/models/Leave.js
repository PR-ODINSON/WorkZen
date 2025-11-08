const mongoose = require('mongoose');
const leaveSchema = new mongoose.Schema({
  empId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  leaveType: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  reason: { type: String },
  status: { type: String, enum: ['pending','approved','rejected'], default: 'pending' }
}, { timestamps: true });
module.exports = mongoose.model('Leave', leaveSchema);
