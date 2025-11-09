import 'dart:typed_data';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:intl/intl.dart';
import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:share_plus/share_plus.dart';
import 'package:open_filex/open_filex.dart';
import '../models/payroll.dart';
import '../models/employee.dart';

class PayslipDetailScreen extends StatelessWidget {
  final Payroll payroll;
  final Employee? employee;

  const PayslipDetailScreen({
    super.key,
    required this.payroll,
    this.employee,
  });

  String _numberToWords(double amount) {
    // Simple implementation - in production, use a proper library
    final rupees = amount.toInt();
    final paise = ((amount - rupees) * 100).toInt();
    
    if (paise > 0) {
      return '${_convertNumber(rupees)} rupees and ${_convertNumber(paise)} paise only';
    }
    return '${_convertNumber(rupees)} rupees only';
  }

  String _convertNumber(int number) {
    // Simplified number to words converter
    // In production, use a proper library like number_to_words
    if (number == 0) return 'Zero';
    if (number < 20) {
      final words = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 
                     'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 
                     'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
      return words[number];
    }
    if (number < 100) {
      final tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 
                    'Seventy', 'Eighty', 'Ninety'];
      final units = number % 10;
      return units > 0 
          ? '${tens[number ~/ 10]} ${_convertNumber(units)}'
          : tens[number ~/ 10];
    }
    if (number < 1000) {
      final hundreds = number ~/ 100;
      final remainder = number % 100;
      return remainder > 0
          ? '${_convertNumber(hundreds)} Hundred ${_convertNumber(remainder)}'
          : '${_convertNumber(hundreds)} Hundred';
    }
    if (number < 100000) {
      final thousands = number ~/ 1000;
      final remainder = number % 1000;
      return remainder > 0
          ? '${_convertNumber(thousands)} Thousand ${_convertNumber(remainder)}'
          : '${_convertNumber(thousands)} Thousand';
    }
    if (number < 10000000) {
      final lakhs = number ~/ 100000;
      final remainder = number % 100000;
      return remainder > 0
          ? '${_convertNumber(lakhs)} Lakh ${_convertNumber(remainder)}'
          : '${_convertNumber(lakhs)} Lakh';
    }
    final crores = number ~/ 10000000;
    final remainder = number % 10000000;
    return remainder > 0
        ? '${_convertNumber(crores)} Crore ${_convertNumber(remainder)}'
        : '${_convertNumber(crores)} Crore';
  }

  Future<void> _printPayslip(BuildContext context) async {
    try {
      // Show loading indicator
      if (!context.mounted) return;
      
      showDialog(
        context: context,
        barrierDismissible: false,
        builder: (context) => const Center(
          child: CircularProgressIndicator(),
        ),
      );

      // Generate PDF bytes
      final pdfBytes = await _generatePdf();
      
      if (!context.mounted) return;
      Navigator.of(context).pop(); // Close loading
      
      final monthStr = DateFormat('yyyy-MM').format(payroll.month);
      final fileName = 'payslip_${payroll.employeeCode}_$monthStr.pdf';

      // Use system temp directory directly (avoids path_provider channel issues)
      // Directory.systemTemp is a built-in Dart feature that works without platform channels
      final tempDir = Directory.systemTemp;
      final filePath = '${tempDir.path}/$fileName';
      
      // Save PDF to file
      final file = File(filePath);
      await file.writeAsBytes(pdfBytes);
      
      // Verify file was created
      if (!await file.exists()) {
        throw Exception('Failed to create PDF file at $filePath');
      }

      if (!context.mounted) return;

      // Show options dialog with Open and Share options
      _showPdfOptionsDialog(context, filePath, fileName);
      
    } catch (e, stackTrace) {
      // Close loading indicator if still open
      if (context.mounted) {
        Navigator.of(context).pop();
      }
      
      debugPrint('PDF Generation Error: $e');
      debugPrint('Stack Trace: $stackTrace');
      
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error: ${e.toString()}'),
            backgroundColor: Colors.red,
            duration: const Duration(seconds: 5),
            action: SnackBarAction(
              label: 'Retry',
              textColor: Colors.white,
              onPressed: () => _printPayslip(context),
            ),
          ),
        );
      }
    }
  }

  Future<void> _sharePdfFile(
    BuildContext context,
    String filePath,
    String fileName,
  ) async {
    try {
      // Share the file
      final xFile = XFile(
        filePath,
        mimeType: 'application/pdf',
        name: fileName,
      );
      
      await Share.shareXFiles(
        [xFile],
        text: 'Payslip for ${DateFormat('MMMM yyyy').format(payroll.month)}',
        subject: 'Payslip - ${payroll.employeeName}',
      );
      
      // Clean up after a delay (file is shared, we can delete it)
      Future.delayed(const Duration(seconds: 5), () {
        try {
          final file = File(filePath);
          if (file.existsSync()) {
            file.deleteSync();
          }
        } catch (e) {
          debugPrint('Error deleting temp file: $e');
        }
      });
    } catch (e) {
      debugPrint('File sharing failed: $e');
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error sharing PDF: $e'),
            backgroundColor: Colors.red,
            duration: const Duration(seconds: 4),
          ),
        );
      }
    }
  }

  void _showPdfOptionsDialog(
    BuildContext context,
    String filePath,
    String fileName,
  ) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) => Container(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(
              Icons.check_circle,
              color: Colors.green,
              size: 48,
            ),
            const SizedBox(height: 16),
            const Text(
              'PDF Generated Successfully',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              fileName,
              style: TextStyle(
                fontSize: 14,
                color: Colors.grey[600],
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 24),
            // Share PDF (Primary action)
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: () async {
                  Navigator.pop(context);
                  try {
                    final xFile = XFile(filePath, mimeType: 'application/pdf');
                    await Share.shareXFiles(
                      [xFile],
                      text: 'Payslip for ${DateFormat('MMMM yyyy').format(payroll.month)}',
                      subject: 'Payslip - ${payroll.employeeName}',
                    );
                  } catch (e) {
                    if (context.mounted) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text('Error sharing: $e'),
                          backgroundColor: Colors.red,
                        ),
                      );
                    }
                  }
                },
                icon: const Icon(Icons.share),
                label: const Text('Share PDF'),
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 16),
                ),
              ),
            ),
            const SizedBox(height: 12),
            // Open PDF (Secondary action)
            SizedBox(
              width: double.infinity,
              child: OutlinedButton.icon(
                onPressed: () async {
                  Navigator.pop(context);
                  try {
                    final result = await OpenFilex.open(filePath);
                    if (result.type != ResultType.done && context.mounted) {
                      // If opening fails, try sharing instead
                      if (context.mounted) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Opening PDF. You can also share it to view.'),
                            backgroundColor: Colors.orange,
                            duration: Duration(seconds: 2),
                          ),
                        );
                      }
                      // Fallback to share
                      final xFile = XFile(filePath, mimeType: 'application/pdf');
                      await Share.shareXFiles([xFile]);
                    }
                  } catch (e) {
                    if (context.mounted) {
                      // On error, try sharing as fallback
                      try {
                        final xFile = XFile(filePath, mimeType: 'application/pdf');
                        await Share.shareXFiles([xFile]);
                      } catch (shareError) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text('Error: $shareError'),
                            backgroundColor: Colors.red,
                          ),
                        );
                      }
                    }
                  }
                },
                icon: const Icon(Icons.open_in_new),
                label: const Text('Open PDF'),
                style: OutlinedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 16),
                ),
              ),
            ),
            const SizedBox(height: 16),
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Close'),
            ),
          ],
        ),
      ),
    );
  }

  Future<Uint8List> _generatePdf() async {
    final pdf = pw.Document();
    // Use "Rs." instead of ₹ for PDF compatibility (Helvetica doesn't support Unicode)
    // Note: Helvetica Unicode warnings may appear in logs but are harmless since we use ASCII characters only
    // The PDF generates correctly despite these warnings
    final currencyFormat = NumberFormat.currency(locale: 'en_IN', symbol: 'Rs.');
    final dateFormat = DateFormat('dd/MM/yyyy');
    final monthFormat = DateFormat('MMMM yyyy');

    pdf.addPage(
      pw.MultiPage(
        pageFormat: PdfPageFormat.a4,
        margin: const pw.EdgeInsets.all(40),
        build: (pw.Context context) {
          return [
            // Header
            pw.Row(
              mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
              children: [
                pw.Container(
                  padding: const pw.EdgeInsets.all(10),
                  decoration: pw.BoxDecoration(
                    border: pw.Border.all(color: PdfColors.grey700),
                    borderRadius: pw.BorderRadius.circular(5),
                  ),
                  child: pw.Text(
                    '[Company Logo]',
                    style: pw.TextStyle(
                      color: PdfColors.grey,
                      fontSize: 10,
                    ),
                  ),
                ),
                pw.Expanded(
                  child: pw.Text(
                    'Salary slip for month of ${monthFormat.format(payroll.month).toLowerCase()}',
                    style: pw.TextStyle(
                      color: PdfColors.cyan,
                      fontSize: 16,
                      fontWeight: pw.FontWeight.bold,
                    ),
                    textAlign: pw.TextAlign.right,
                  ),
                ),
              ],
            ),
            pw.SizedBox(height: 20),

            // Employee and Payment Details
            pw.Container(
              padding: const pw.EdgeInsets.all(15),
              decoration: pw.BoxDecoration(
                border: pw.Border.all(color: PdfColors.grey700),
                borderRadius: pw.BorderRadius.circular(5),
              ),
              child: pw.Row(
                crossAxisAlignment: pw.CrossAxisAlignment.start,
                children: [
                  // Left Column
                  pw.Expanded(
                    child: pw.Column(
                      crossAxisAlignment: pw.CrossAxisAlignment.start,
                      children: [
                        _buildPdfDetailRow('Employee name', payroll.employeeName),
                        pw.SizedBox(height: 8),
                        _buildPdfDetailRow('Employee Code', payroll.employeeCode),
                        pw.SizedBox(height: 8),
                        _buildPdfDetailRow('Department', payroll.department),
                        pw.SizedBox(height: 8),
                        _buildPdfDetailRow('Location', payroll.location),
                        pw.SizedBox(height: 8),
                        _buildPdfDetailRow(
                          'Date of joining',
                          dateFormat.format(payroll.dateOfJoining),
                        ),
                      ],
                    ),
                  ),
                  pw.SizedBox(width: 20),
                  // Right Column
                  pw.Expanded(
                    child: pw.Column(
                      crossAxisAlignment: pw.CrossAxisAlignment.start,
                      children: [
                        _buildPdfDetailRow('PAN', payroll.pan),
                        pw.SizedBox(height: 8),
                        _buildPdfDetailRow('UAN', payroll.uan),
                        pw.SizedBox(height: 8),
                        _buildPdfDetailRow('Bank A/c NO.', payroll.bankAccountNumber),
                        pw.SizedBox(height: 8),
                        _buildPdfDetailRow(
                          'Pay period',
                          '${dateFormat.format(payroll.payPeriodStart)} to ${dateFormat.format(payroll.payPeriodEnd)}',
                        ),
                        pw.SizedBox(height: 8),
                        _buildPdfDetailRow(
                          'Pay date',
                          dateFormat.format(payroll.payDate),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            pw.SizedBox(height: 20),

            // Worked Days Section
            pw.Container(
              padding: const pw.EdgeInsets.all(15),
              decoration: pw.BoxDecoration(
                border: pw.Border.all(color: PdfColors.grey700),
                borderRadius: pw.BorderRadius.circular(5),
              ),
              child: pw.Column(
                crossAxisAlignment: pw.CrossAxisAlignment.start,
                children: [
                  pw.Row(
                    mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                    children: [
                      pw.Text(
                        'Worked Days',
                        style: pw.TextStyle(
                          color: PdfColors.purple,
                          fontSize: 14,
                          fontWeight: pw.FontWeight.bold,
                        ),
                      ),
                      pw.Text(
                        'Number of Days',
                        style: pw.TextStyle(
                          color: PdfColors.purple,
                          fontSize: 14,
                          fontWeight: pw.FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                  pw.Divider(color: PdfColors.grey),
                  pw.SizedBox(height: 10),
                  pw.Row(
                    mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                    children: [
                      pw.Text(
                        'Attendance',
                        style: const pw.TextStyle(fontSize: 12),
                      ),
                      pw.Text(
                        '${payroll.attendanceDays} Days',
                        style: const pw.TextStyle(fontSize: 12),
                      ),
                    ],
                  ),
                  pw.SizedBox(height: 8),
                  pw.Row(
                    mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                    children: [
                      pw.Text(
                        'Total',
                        style: pw.TextStyle(
                          fontSize: 12,
                          fontWeight: pw.FontWeight.bold,
                        ),
                      ),
                      pw.Text(
                        '${payroll.totalDays} Days',
                        style: pw.TextStyle(
                          fontSize: 12,
                          fontWeight: pw.FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            pw.SizedBox(height: 20),

            // Earnings and Deductions Section
            pw.Container(
              padding: const pw.EdgeInsets.all(15),
              decoration: pw.BoxDecoration(
                border: pw.Border.all(color: PdfColors.grey700),
                borderRadius: pw.BorderRadius.circular(5),
              ),
              child: pw.Column(
                crossAxisAlignment: pw.CrossAxisAlignment.start,
                children: [
                  // Table Header
                  pw.Row(
                    children: [
                      pw.Expanded(
                        flex: 2,
                        child: pw.Text(
                          'Earnings',
                          style: pw.TextStyle(
                            color: PdfColors.purple,
                            fontSize: 14,
                            fontWeight: pw.FontWeight.bold,
                          ),
                        ),
                      ),
                      pw.Expanded(
                        flex: 1,
                        child: pw.Text(
                          'Amounts',
                          style: pw.TextStyle(
                            color: PdfColors.purple,
                            fontSize: 14,
                            fontWeight: pw.FontWeight.bold,
                          ),
                          textAlign: pw.TextAlign.right,
                        ),
                      ),
                      pw.Expanded(
                        flex: 2,
                        child: pw.Text(
                          'Deductions',
                          style: pw.TextStyle(
                            color: PdfColors.purple,
                            fontSize: 14,
                            fontWeight: pw.FontWeight.bold,
                          ),
                          textAlign: pw.TextAlign.center,
                        ),
                      ),
                      pw.Expanded(
                        flex: 1,
                        child: pw.Text(
                          'Amounts',
                          style: pw.TextStyle(
                            color: PdfColors.purple,
                            fontSize: 14,
                            fontWeight: pw.FontWeight.bold,
                          ),
                          textAlign: pw.TextAlign.right,
                        ),
                      ),
                    ],
                  ),
                  pw.Divider(color: PdfColors.grey),
                  pw.SizedBox(height: 10),
                  // Table Rows
                  ..._buildPdfTableRows(currencyFormat),
                  pw.SizedBox(height: 10),
                  // Total Row
                  pw.Container(
                    padding: const pw.EdgeInsets.symmetric(vertical: 8),
                    decoration: pw.BoxDecoration(
                      border: pw.Border(
                        top: pw.BorderSide(color: PdfColors.grey700),
                      ),
                    ),
                    child: pw.Row(
                      children: [
                        pw.Expanded(
                          flex: 2,
                          child: pw.Text(
                            'Gross',
                            style: pw.TextStyle(
                              color: PdfColors.grey700,
                              fontSize: 12,
                              fontWeight: pw.FontWeight.bold,
                            ),
                          ),
                        ),
                        pw.Expanded(
                          flex: 1,
                          child: pw.Text(
                            currencyFormat.format(
                              payroll.earnings.fold(0.0, (sum, e) => sum + e.amount),
                            ),
                            style: pw.TextStyle(
                              color: PdfColors.grey700,
                              fontSize: 12,
                              fontWeight: pw.FontWeight.bold,
                            ),
                            textAlign: pw.TextAlign.right,
                          ),
                        ),
                        pw.Expanded(
                          flex: 2,
                          child: pw.Text(
                            'Total Deductions',
                            style: pw.TextStyle(
                              color: PdfColors.grey700,
                              fontSize: 12,
                              fontWeight: pw.FontWeight.bold,
                            ),
                            textAlign: pw.TextAlign.center,
                          ),
                        ),
                        pw.Expanded(
                          flex: 1,
                          child: pw.Text(
                            currencyFormat.format(
                              payroll.deductions.fold(0.0, (sum, d) => sum + d.amount),
                            ),
                            style: pw.TextStyle(
                              color: PdfColors.grey700,
                              fontSize: 12,
                              fontWeight: pw.FontWeight.bold,
                            ),
                            textAlign: pw.TextAlign.right,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            pw.SizedBox(height: 20),

            // Total Net Payable
            pw.Container(
              padding: const pw.EdgeInsets.all(15),
              decoration: pw.BoxDecoration(
                border: pw.Border.all(color: PdfColors.purple, width: 2),
                borderRadius: pw.BorderRadius.circular(5),
              ),
              child: pw.Column(
                crossAxisAlignment: pw.CrossAxisAlignment.start,
                children: [
                  pw.Text(
                    'Total Net Payable (Gross Earning - Total deductions)',
                    style: pw.TextStyle(
                      color: PdfColors.purple,
                      fontSize: 14,
                      fontWeight: pw.FontWeight.bold,
                    ),
                  ),
                  pw.SizedBox(height: 12),
                  pw.Container(
                    padding: const pw.EdgeInsets.all(15),
                    decoration: pw.BoxDecoration(
                      color: PdfColors.cyan,
                      borderRadius: pw.BorderRadius.circular(5),
                    ),
                    child: pw.Column(
                      crossAxisAlignment: pw.CrossAxisAlignment.end,
                      children: [
                        pw.Text(
                          currencyFormat.format(payroll.netPay),
                          style: const pw.TextStyle(
                            color: PdfColors.white,
                            fontSize: 20,
                            fontWeight: pw.FontWeight.bold,
                          ),
                        ),
                        pw.SizedBox(height: 6),
                        pw.Text(
                          _numberToWords(payroll.netPay),
                          style: const pw.TextStyle(
                            color: PdfColors.white,
                            fontSize: 10,
                          ),
                          textAlign: pw.TextAlign.right,
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ];
        },
      ),
    );

    return pdf.save();
  }

  pw.Widget _buildPdfDetailRow(String label, String value) {
    return pw.Row(
      crossAxisAlignment: pw.CrossAxisAlignment.start,
      children: [
        pw.Text(
          '$label : ',
          style: pw.TextStyle(
            color: PdfColors.grey600,
            fontSize: 11,
            fontWeight: pw.FontWeight.normal,
          ),
        ),
        pw.Expanded(
          child: pw.Text(
            value,
            style: const pw.TextStyle(
              fontSize: 11,
            ),
          ),
        ),
      ],
    );
  }

  List<pw.Widget> _buildPdfTableRows(NumberFormat currencyFormat) {
    final maxRows = payroll.earnings.length > payroll.deductions.length
        ? payroll.earnings.length
        : payroll.deductions.length;

    return List.generate(maxRows, (index) {
      final earning = index < payroll.earnings.length ? payroll.earnings[index] : null;
      final deduction = index < payroll.deductions.length ? payroll.deductions[index] : null;

      return pw.Padding(
        padding: const pw.EdgeInsets.only(bottom: 8),
        child: pw.Row(
          children: [
            pw.Expanded(
              flex: 2,
              child: pw.Text(
                earning?.name ?? '',
                style: const pw.TextStyle(fontSize: 11),
              ),
            ),
            pw.Expanded(
              flex: 1,
              child: pw.Text(
                earning != null ? currencyFormat.format(earning.amount) : '',
                style: const pw.TextStyle(fontSize: 11),
                textAlign: pw.TextAlign.right,
              ),
            ),
            pw.Expanded(
              flex: 2,
              child: pw.Text(
                deduction?.name ?? '',
                style: const pw.TextStyle(fontSize: 11),
                textAlign: pw.TextAlign.center,
              ),
            ),
            pw.Expanded(
              flex: 1,
              child: pw.Text(
                deduction != null
                    ? '- ${currencyFormat.format(deduction.amount)}'
                    : '',
                style: const pw.TextStyle(fontSize: 11),
                textAlign: pw.TextAlign.right,
              ),
            ),
          ],
        ),
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    final currencyFormat = NumberFormat.currency(locale: 'en_IN', symbol: '₹');
    final dateFormat = DateFormat('dd/MM/yyyy');
    final monthFormat = DateFormat('MMMM yyyy');

    return Scaffold(
      backgroundColor: Colors.grey[900],
      appBar: AppBar(
        backgroundColor: Colors.grey[900],
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: const Text(
          'Salary Slip',
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.print, color: Colors.white),
            onPressed: () => _printPayslip(context),
            tooltip: 'Print',
          ),
        ],
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          physics: const BouncingScrollPhysics(),
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
          child: Container(
            constraints: BoxConstraints(
              minHeight: MediaQuery.of(context).size.height - 
                         MediaQuery.of(context).padding.top - 
                         kToolbarHeight - 32,
            ),
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.grey[850],
              borderRadius: BorderRadius.circular(12),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.3),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                // Header
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Flexible(
                      flex: 2,
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 16,
                          vertical: 12,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.grey[800],
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: Colors.grey[700]!),
                        ),
                        child: const Text(
                          '[Company Logo]',
                          style: TextStyle(
                            color: Colors.grey,
                            fontSize: 12,
                            fontWeight: FontWeight.w500,
                          ),
                          textAlign: TextAlign.center,
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Flexible(
                      flex: 3,
                      child: Text(
                        'Salary slip for month of ${monthFormat.format(payroll.month).toLowerCase()}',
                        style: const TextStyle(
                          color: Color(0xFF00BCD4),
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                        textAlign: TextAlign.right,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 20),
                
                // Employee and Payment Details
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.grey[800],
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: Colors.grey[700]!),
                  ),
                  child: LayoutBuilder(
                    builder: (context, constraints) {
                      final isSmallScreen = constraints.maxWidth < 600;
                      return isSmallScreen
                          ? _buildSingleColumnDetails(dateFormat)
                          : _buildTwoColumnDetails(dateFormat);
                    },
                  ),
                ),
                const SizedBox(height: 20),
                
                // Worked Days Section
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.grey[800],
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: Colors.grey[700]!),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            'Worked Days',
                            style: TextStyle(
                              color: Colors.purple,
                              fontSize: 15,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const Text(
                            'Number of Days',
                            style: TextStyle(
                              color: Colors.purple,
                              fontSize: 15,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      const Divider(color: Colors.grey, height: 1),
                      const SizedBox(height: 12),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            'Attendance',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 14,
                            ),
                          ),
                          Text(
                            '${payroll.attendanceDays} Days',
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 14,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 10),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            'Total',
                            style: TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                              fontSize: 14,
                            ),
                          ),
                          Text(
                            '${payroll.totalDays} Days',
                            style: const TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                              fontSize: 14,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 20),
                
                // Earnings and Deductions Section
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.grey[800],
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: Colors.grey[700]!),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      LayoutBuilder(
                        builder: (context, constraints) {
                          if (constraints.maxWidth < 600) {
                            // Mobile layout - stack earnings and deductions
                            return Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                _buildEarningsSection(currencyFormat),
                                const SizedBox(height: 20),
                                _buildDeductionsSection(currencyFormat),
                              ],
                            );
                          } else {
                            // Desktop layout - side by side with header
                            return Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                // Table Header
                                Row(
                                  children: [
                                    Expanded(
                                      flex: 2,
                                      child: const Text(
                                        'Earnings',
                                        style: TextStyle(
                                          color: Colors.purple,
                                          fontSize: 15,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                    ),
                                    Expanded(
                                      flex: 1,
                                      child: const Text(
                                        'Amounts',
                                        style: TextStyle(
                                          color: Colors.purple,
                                          fontSize: 15,
                                          fontWeight: FontWeight.bold,
                                        ),
                                        textAlign: TextAlign.right,
                                      ),
                                    ),
                                    Expanded(
                                      flex: 2,
                                      child: const Text(
                                        'Deductions',
                                        style: TextStyle(
                                          color: Colors.purple,
                                          fontSize: 15,
                                          fontWeight: FontWeight.bold,
                                        ),
                                        textAlign: TextAlign.center,
                                      ),
                                    ),
                                    Expanded(
                                      flex: 1,
                                      child: const Text(
                                        'Amounts',
                                        style: TextStyle(
                                          color: Colors.purple,
                                          fontSize: 15,
                                          fontWeight: FontWeight.bold,
                                        ),
                                        textAlign: TextAlign.right,
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 12),
                                const Divider(color: Colors.grey, height: 1),
                                const SizedBox(height: 12),
                                // Table Rows
                                _EarningsDeductionsTable(
                                  earnings: payroll.earnings,
                                  deductions: payroll.deductions,
                                  currencyFormat: currencyFormat,
                                ),
                              ],
                            );
                          }
                        },
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 20),
                
                // Total Net Payable
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.grey[800],
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: Colors.purple, width: 2),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Total Net Payable (Gross Earning - Total deductions)',
                        style: const TextStyle(
                          color: Colors.purple,
                          fontSize: 15,
                          fontWeight: FontWeight.bold,
                        ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 12),
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.symmetric(
                          horizontal: 20,
                          vertical: 16,
                        ),
                        decoration: BoxDecoration(
                          color: const Color(0xFF00BCD4),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            FittedBox(
                              fit: BoxFit.scaleDown,
                              child: Text(
                                currencyFormat.format(payroll.netPay),
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 24,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                            const SizedBox(height: 6),
                            Text(
                              _numberToWords(payroll.netPay),
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 11,
                                height: 1.3,
                              ),
                              textAlign: TextAlign.right,
                              maxLines: 3,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 8),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildTwoColumnDetails(DateFormat dateFormat) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _DetailRow(
                label: 'Employee name',
                value: payroll.employeeName,
              ),
              const SizedBox(height: 10),
              _DetailRow(
                label: 'Employee Code',
                value: payroll.employeeCode,
              ),
              const SizedBox(height: 10),
              _DetailRow(
                label: 'Department',
                value: payroll.department,
              ),
              const SizedBox(height: 10),
              _DetailRow(
                label: 'Location',
                value: payroll.location,
              ),
              const SizedBox(height: 10),
              _DetailRow(
                label: 'Date of joining',
                value: dateFormat.format(payroll.dateOfJoining),
              ),
            ],
          ),
        ),
        const SizedBox(width: 20),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _DetailRow(
                label: 'PAN',
                value: payroll.pan,
              ),
              const SizedBox(height: 10),
              _DetailRow(
                label: 'UAN',
                value: payroll.uan,
              ),
              const SizedBox(height: 10),
              _DetailRow(
                label: 'Bank A/c NO.',
                value: payroll.bankAccountNumber,
              ),
              const SizedBox(height: 10),
              _DetailRow(
                label: 'Pay period',
                value: '${dateFormat.format(payroll.payPeriodStart)} to ${dateFormat.format(payroll.payPeriodEnd)}',
              ),
              const SizedBox(height: 10),
              _DetailRow(
                label: 'Pay date',
                value: dateFormat.format(payroll.payDate),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildSingleColumnDetails(DateFormat dateFormat) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _DetailRow(
          label: 'Employee name',
          value: payroll.employeeName,
        ),
        const SizedBox(height: 10),
        _DetailRow(
          label: 'Employee Code',
          value: payroll.employeeCode,
        ),
        const SizedBox(height: 10),
        _DetailRow(
          label: 'Department',
          value: payroll.department,
        ),
        const SizedBox(height: 10),
        _DetailRow(
          label: 'Location',
          value: payroll.location,
        ),
        const SizedBox(height: 10),
        _DetailRow(
          label: 'Date of joining',
          value: dateFormat.format(payroll.dateOfJoining),
        ),
        const SizedBox(height: 10),
        _DetailRow(
          label: 'PAN',
          value: payroll.pan,
        ),
        const SizedBox(height: 10),
        _DetailRow(
          label: 'UAN',
          value: payroll.uan,
        ),
        const SizedBox(height: 10),
        _DetailRow(
          label: 'Bank A/c NO.',
          value: payroll.bankAccountNumber,
        ),
        const SizedBox(height: 10),
        _DetailRow(
          label: 'Pay period',
          value: '${dateFormat.format(payroll.payPeriodStart)} to ${dateFormat.format(payroll.payPeriodEnd)}',
        ),
        const SizedBox(height: 10),
        _DetailRow(
          label: 'Pay date',
          value: dateFormat.format(payroll.payDate),
        ),
      ],
    );
  }

  Widget _buildEarningsSection(NumberFormat currencyFormat) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Earnings',
          style: TextStyle(
            color: Colors.purple,
            fontSize: 15,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 12),
        ...payroll.earnings.map((earning) => Padding(
          padding: const EdgeInsets.only(bottom: 10),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Text(
                  earning.name,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 14,
                  ),
                ),
              ),
              Text(
                currencyFormat.format(earning.amount),
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
        )),
        const Divider(color: Colors.grey, height: 20),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text(
              'Gross',
              style: TextStyle(
                color: Colors.grey,
                fontSize: 14,
                fontWeight: FontWeight.bold,
              ),
            ),
            Text(
              currencyFormat.format(
                payroll.earnings.fold(0.0, (sum, e) => sum + e.amount),
              ),
              style: const TextStyle(
                color: Colors.grey,
                fontSize: 14,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildDeductionsSection(NumberFormat currencyFormat) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Deductions',
          style: TextStyle(
            color: Colors.purple,
            fontSize: 15,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 12),
        ...payroll.deductions.map((deduction) => Padding(
          padding: const EdgeInsets.only(bottom: 10),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Text(
                  deduction.name,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 14,
                  ),
                ),
              ),
              Text(
                '- ${currencyFormat.format(deduction.amount)}',
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
        )),
        const Divider(color: Colors.grey, height: 20),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text(
              'Total Deductions',
              style: TextStyle(
                color: Colors.grey,
                fontSize: 14,
                fontWeight: FontWeight.bold,
              ),
            ),
            Text(
              currencyFormat.format(
                payroll.deductions.fold(0.0, (sum, d) => sum + d.amount),
              ),
              style: const TextStyle(
                color: Colors.grey,
                fontSize: 14,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ],
    );
  }
}

class _DetailRow extends StatelessWidget {
  final String label;
  final String value;

  const _DetailRow({
    required this.label,
    required this.value,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Flexible(
          flex: 2,
          child: Text(
            '$label :',
            style: TextStyle(
              color: Colors.grey[400],
              fontSize: 13,
              fontWeight: FontWeight.w500,
            ),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ),
        const SizedBox(width: 8),
        Flexible(
          flex: 3,
          child: Text(
            value,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 13,
              fontWeight: FontWeight.w400,
            ),
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
          ),
        ),
      ],
    );
  }
}

class _EarningsDeductionsTable extends StatelessWidget {
  final List<PayrollEarning> earnings;
  final List<PayrollDeduction> deductions;
  final NumberFormat currencyFormat;

  const _EarningsDeductionsTable({
    required this.earnings,
    required this.deductions,
    required this.currencyFormat,
  });

  @override
  Widget build(BuildContext context) {
    final maxRows = earnings.length > deductions.length
        ? earnings.length
        : deductions.length;

    return Table(
      columnWidths: const {
        0: FlexColumnWidth(2.2),
        1: FlexColumnWidth(1.8),
        2: FlexColumnWidth(2.2),
        3: FlexColumnWidth(1.8),
      },
      children: List.generate(maxRows + 1, (index) {
        if (index == maxRows) {
          // Total row
          return TableRow(
            decoration: BoxDecoration(
              border: Border(
                top: BorderSide(color: Colors.grey[700]!, width: 1),
              ),
            ),
            children: [
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 10),
                child: Text(
                  'Gross',
                  style: TextStyle(
                    color: Colors.grey[300],
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 10),
                child: FittedBox(
                  fit: BoxFit.scaleDown,
                  alignment: Alignment.centerRight,
                  child: Text(
                    currencyFormat.format(
                      earnings.fold(0.0, (sum, e) => sum + e.amount),
                    ),
                    style: TextStyle(
                      color: Colors.grey[300],
                      fontWeight: FontWeight.bold,
                      fontSize: 14,
                    ),
                    textAlign: TextAlign.right,
                  ),
                ),
              ),
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 10),
                child: Text(
                  'Total Deductions',
                  style: TextStyle(
                    color: Colors.grey[300],
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                  ),
                  textAlign: TextAlign.center,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 10),
                child: FittedBox(
                  fit: BoxFit.scaleDown,
                  alignment: Alignment.centerRight,
                  child: Text(
                    currencyFormat.format(
                      deductions.fold(0.0, (sum, d) => sum + d.amount),
                    ),
                    style: TextStyle(
                      color: Colors.grey[300],
                      fontWeight: FontWeight.bold,
                      fontSize: 14,
                    ),
                    textAlign: TextAlign.right,
                  ),
                ),
              ),
            ],
          );
        }

        final earning = index < earnings.length ? earnings[index] : null;
        final deduction = index < deductions.length ? deductions[index] : null;

        return TableRow(
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 10),
              child: Text(
                earning?.name ?? '',
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 13,
                ),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 10),
              child: FittedBox(
                fit: BoxFit.scaleDown,
                alignment: Alignment.centerRight,
                child: Text(
                  earning != null
                      ? currencyFormat.format(earning.amount)
                      : '',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 13,
                    fontWeight: FontWeight.w500,
                  ),
                  textAlign: TextAlign.right,
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 10),
              child: Text(
                deduction?.name ?? '',
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 13,
                ),
                textAlign: TextAlign.center,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 10),
              child: FittedBox(
                fit: BoxFit.scaleDown,
                alignment: Alignment.centerRight,
                child: Text(
                  deduction != null
                      ? '- ${currencyFormat.format(deduction.amount)}'
                      : '',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 13,
                    fontWeight: FontWeight.w500,
                  ),
                  textAlign: TextAlign.right,
                ),
              ),
            ),
          ],
        );
      }),
    );
  }
}

