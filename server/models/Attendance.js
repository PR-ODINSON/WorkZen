const mongoose = require('mongoose');
const attendanceSchema = new mongoose.Schema({
  empId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  date: { type: Date, required: true },
  checkIn: { type: Date },
  checkOut: { type: Date },
  status: { type: String, enum: ['present','absent','leave','holiday'], default: 'present' }
}, { timestamps: true });
module.exports = mongoose.model('Attendance', attendanceSchema);
