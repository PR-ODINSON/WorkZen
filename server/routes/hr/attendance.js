const express = require('express');
const router = express.Router();
const attendanceCtrl = require('../../controllers/admin/attendanceController');
const { verifyToken, hrOnly } = require('../../middlewares/authMiddleware');

// Apply auth middleware to all routes
router.use(verifyToken, hrOnly);

// GET /api/hr/attendance - Get all attendance records
router.get('/', attendanceCtrl.list);

// POST /api/hr/attendance - Create new attendance record
router.post('/', attendanceCtrl.create);

// GET /api/hr/attendance/:id - Get attendance record by ID
router.get('/:id', attendanceCtrl.get);

// PUT /api/hr/attendance/:id - Update attendance record
router.put('/:id', attendanceCtrl.update);

// DELETE /api/hr/attendance/:id - Delete attendance record
router.delete('/:id', attendanceCtrl.remove);

module.exports = router;

