const express = require('express');
const router = express.Router();
const attendanceCtrl = require('../../controllers/admin/attendanceController');
const { verifyToken, adminOnly } = require('../../middlewares/authMiddleware');

// Apply auth middleware to all routes
router.use(verifyToken, adminOnly);

// GET /api/admin/attendance - Get all attendance records
router.get('/', attendanceCtrl.list);

// POST /api/admin/attendance - Create new attendance record
router.post('/', attendanceCtrl.create);

// GET /api/admin/attendance/:id - Get attendance record by ID
router.get('/:id', attendanceCtrl.get);

// PUT /api/admin/attendance/:id - Update attendance record
router.put('/:id', attendanceCtrl.update);

// DELETE /api/admin/attendance/:id - Delete attendance record
router.delete('/:id', attendanceCtrl.remove);

module.exports = router;
