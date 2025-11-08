const mongoose = require('mongoose');
const payrollSchema = new mongoose.Schema({
  empId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  gross: { type: Number },
  deductions: { type: Number },
  netPay: { type: Number }
}, { timestamps: true });
module.exports = mongoose.model('Payroll', payrollSchema);
