import api from '../api';

/**
 * Attendance Service - API calls for attendance management
 */

export const attendanceService = {
  /**
   * Get all attendance records
   */
  getAll: async (params = {}) => {
    const response = await api.get('/admin/attendance', { params });
    return response.data;
  },

  /**
   * Get attendance by ID
   */
  getById: async (id) => {
    const response = await api.get(`/admin/attendance/${id}`);
    return response.data;
  },

  /**
   * Create attendance record
   */
  create: async (attendanceData) => {
    const response = await api.post('/admin/attendance', attendanceData);
    return response.data;
  },

  /**
   * Update attendance record
   */
  update: async (id, attendanceData) => {
    const response = await api.put(`/admin/attendance/${id}`, attendanceData);
    return response.data;
  },

  /**
   * Delete attendance record
   */
  delete: async (id) => {
    const response = await api.delete(`/admin/attendance/${id}`);
    return response.data;
  },
};

export default attendanceService;
