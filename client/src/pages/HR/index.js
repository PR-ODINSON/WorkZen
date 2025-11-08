// This file exports all HR pages using Admin pages as templates
// HR can manage employees, attendance, and leaves but has limited access compared to Admin

export { default as Dashboard } from './Dashboard'
export { default as Employees } from '../Admin/Employees'
export { default as Attendance } from '../Admin/Attendance'
export { default as TimeOff } from '../Admin/TimeOff'
export { default as Reports } from '../Admin/Reports'
export { default as MyProfile } from '../Admin/MyProfile'
export { default as Sidebar } from './Sidebar'
