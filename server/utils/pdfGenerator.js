const PDFDocument = require('pdfkit');

/**
 * Generate a payslip PDF for an employee
 * @param {Object} payslipData - Complete payslip data
 * @returns {PDFDocument} - PDF document stream
 */
function generatePayslipPDF(payslipData) {
  const { employee, payrun, salaryStructure, workedDays, salaryComputation } = payslipData;

  // Create a document
  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 30, bottom: 30, left: 30, right: 30 },
    bufferPages: true
  });

  // Set background color for header
  const primaryColor = '#1e40af'; // blue-700
  const lightBg = '#f1f5f9'; // slate-100
  const darkBg = '#e2e8f0'; // slate-200
  const accentColor = '#c084fc'; // purple-400

  // Helper function to format currency
  const formatCurrency = (amount) => {
    return `₹ ${Math.abs(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Company Logo/Header - Dark background
  doc.rect(0, 0, doc.page.width, 60).fill('#1f2937');
  
  doc.fontSize(18)
    .fillColor('#ffffff')
    .text('Odoo India', 40, 20);

  // Title Section - Blue background
  doc.rect(0, 60, doc.page.width, 40).fill(primaryColor);
  
  doc.fontSize(16)
    .fillColor('#ffffff')
    .text(`Salary slip for month of ${payrun.monthName} ${payrun.year}`, 40, 72);

  let yPos = 120;

  // Employee Information Section - Light background
  doc.rect(30, yPos, doc.page.width - 60, 120).fill(lightBg);
  
  yPos += 15;
  
  // Left column
  doc.fontSize(10)
    .fillColor('#1e293b')
    .text('Employee name', 50, yPos)
    .fillColor('#3b82f6')
    .text(`: ${employee.name}`, 170, yPos);
  
  yPos += 20;
  doc.fillColor('#1e293b')
    .text('Employee Code', 50, yPos)
    .fillColor('#3b82f6')
    .text(`: ${employee.employeeId || employee.code}`, 170, yPos);
  
  yPos += 20;
  doc.fillColor('#1e293b')
    .text('Department', 50, yPos)
    .fillColor('#3b82f6')
    .text(`: ${employee.department}`, 170, yPos);
  
  yPos += 20;
  doc.fillColor('#1e293b')
    .text('Location', 50, yPos)
    .fillColor('#3b82f6')
    .text(`: ${employee.location}`, 170, yPos);
  
  yPos += 20;
  doc.fillColor('#1e293b')
    .text('Date of joining', 50, yPos)
    .fillColor('#3b82f6')
    .text(`: ${employee.dateOfJoining}`, 170, yPos);

  // Right column
  yPos = 135;
  doc.fillColor('#1e293b')
    .text('PAN', 320, yPos)
    .fillColor('#3b82f6')
    .text(`: ${employee.pan}`, 440, yPos);
  
  yPos += 20;
  doc.fillColor('#1e293b')
    .text('UAN', 320, yPos)
    .fillColor('#3b82f6')
    .text(`: ${employee.uan}`, 440, yPos);
  
  yPos += 20;
  doc.fillColor('#1e293b')
    .text('Bank A/c NO.', 320, yPos)
    .fillColor('#3b82f6')
    .text(`: ${employee.bankAccount}`, 440, yPos);
  
  yPos += 20;
  doc.fillColor('#1e293b')
    .text('Pay period', 320, yPos)
    .fillColor('#3b82f6')
    .text(`: ${payrun.period}`, 440, yPos);
  
  yPos += 20;
  doc.fillColor('#1e293b')
    .text('Pay date', 320, yPos)
    .fillColor('#3b82f6')
    .text(`: ${payrun.payDate}`, 440, yPos);

  yPos += 35;

  // Worked Days Section Header - Purple background
  doc.rect(30, yPos, doc.page.width - 60, 25).fill(accentColor);
  
  doc.fontSize(11)
    .fillColor('#ffffff')
    .text('Worked Days', 50, yPos + 8)
    .text('Number of Days', doc.page.width - 200, yPos + 8);

  yPos += 25;

  // Worked Days Content
  doc.rect(30, yPos, doc.page.width - 60, 60).fill('#ffffff').stroke('#cbd5e1');
  
  yPos += 15;
  doc.fontSize(10)
    .fillColor('#1e293b')
    .text('Attendance', 50, yPos)
    .text(`${workedDays.attendance.days.toFixed(2)} Days`, doc.page.width - 200, yPos);
  
  yPos += 20;
  doc.text('Total', 50, yPos)
    .text(`${workedDays.workingDaysInMonth.toFixed(2)} Days`, doc.page.width - 200, yPos);

  yPos += 35;

  // Earnings and Deductions Section Header - Purple background
  doc.rect(30, yPos, (doc.page.width - 80) / 2, 25).fill(accentColor);
  doc.rect(30 + (doc.page.width - 80) / 2 + 20, yPos, (doc.page.width - 80) / 2, 25).fill(accentColor);
  
  doc.fontSize(11)
    .fillColor('#ffffff')
    .text('Earnings', 50, yPos + 8)
    .text('Amounts', 220, yPos + 8)
    .text('Deductions', 30 + (doc.page.width - 80) / 2 + 40, yPos + 8)
    .text('Amounts', 30 + (doc.page.width - 80) / 2 + 200, yPos + 8);

  yPos += 25;

  // Calculate the height needed for earnings/deductions
  const maxRows = Math.max(salaryComputation.earnings.length, salaryComputation.deductions.length);
  const contentHeight = maxRows * 20 + 30;

  // Draw white background for content
  doc.rect(30, yPos, (doc.page.width - 80) / 2, contentHeight).fill('#ffffff').stroke('#cbd5e1');
  doc.rect(30 + (doc.page.width - 80) / 2 + 20, yPos, (doc.page.width - 80) / 2, contentHeight).fill('#ffffff').stroke('#cbd5e1');

  yPos += 15;
  const earningsStartY = yPos;
  const deductionsStartY = yPos;

  // Earnings
  doc.fontSize(9).fillColor('#1e293b');
  salaryComputation.earnings.forEach((earning, index) => {
    const currentY = earningsStartY + (index * 20);
    doc.text(earning.ruleName, 50, currentY)
      .text(formatCurrency(earning.amount), 220, currentY, { width: 80, align: 'left' });
  });

  // Deductions
  salaryComputation.deductions.forEach((deduction, index) => {
    const currentY = deductionsStartY + (index * 20);
    doc.text(deduction.ruleName, 30 + (doc.page.width - 80) / 2 + 40, currentY)
      .text(`- ${formatCurrency(deduction.amount)}`, 30 + (doc.page.width - 80) / 2 + 200, currentY, { width: 80, align: 'left' });
  });

  yPos += contentHeight + 5;

  // Gross and Bonus section - Light background
  doc.rect(30, yPos, (doc.page.width - 80) / 2, 20).fill(lightBg);
  doc.fontSize(10)
    .fillColor('#1e293b')
    .text('Gross', 50, yPos + 5)
    .text(formatCurrency(salaryComputation.gross), 220, yPos + 5);

  yPos += 30;

  // Total Net Payable Section - Cyan/Blue highlight
  doc.rect(30, yPos, doc.page.width - 60, 40).fill('#06b6d4');
  
  doc.fontSize(12)
    .fillColor('#ffffff')
    .text('Total Net Payable', 50, yPos + 8)
    .fontSize(11)
    .text('(Gross Earning - Total deductions)', 50, yPos + 24)
    .fontSize(14)
    .fillColor('#000000')
    .text(formatCurrency(salaryComputation.netAmount), doc.page.width - 200, yPos + 12);
  
  doc.fontSize(9)
    .fillColor('#000000')
    .text('[Amount in words] only', doc.page.width - 200, yPos + 28);

  return doc;
}

module.exports = { generatePayslipPDF };
