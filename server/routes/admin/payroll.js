const express = require('express');
const router = express.Router();
const payrollCtrl = require('../../controllers/admin/payrollController');
const { verifyToken, adminOnly } = require('../../middlewares/authMiddleware');

// Apply auth middleware to all routes
router.use(verifyToken, adminOnly);

// Dashboard Route
// GET /api/admin/payroll/dashboard - Get payroll dashboard data
router.get('/dashboard', payrollCtrl.getDashboard);

// Payroll Routes
// GET /api/admin/payroll - Get all payroll records
router.get('/', payrollCtrl.list);

// POST /api/admin/payroll - Create new payroll record
router.post('/', payrollCtrl.create);

// GET /api/admin/payroll/:id - Get payroll record by ID
router.get('/:id', payrollCtrl.get);

// PUT /api/admin/payroll/:id - Update payroll record
router.put('/:id', payrollCtrl.update);

// DELETE /api/admin/payroll/:id - Delete payroll record
router.delete('/:id', payrollCtrl.remove);

// Payrun Routes
// GET /api/admin/payroll/payruns - Get all payruns
router.get('/payruns/list', payrollCtrl.listPayruns);

// POST /api/admin/payroll/payruns - Create new payrun
router.post('/payruns', payrollCtrl.createPayrun);

// PATCH /api/admin/payroll/payruns/:id/status - Update payrun status
router.patch('/payruns/:id/status', payrollCtrl.updatePayrunStatus);

module.exports = router;
