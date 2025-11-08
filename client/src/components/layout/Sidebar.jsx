import React from 'react'
import { NavLink } from 'react-router-dom'

const Sidebar = ()=>{
  const links = [
    ['Dashboard','/dashboard'],
    ['Employees','/employees'],
    ['Attendance','/attendance'],
    ['Time Off','/timeoff'],
    ['Payroll','/payroll'],
    ['Reports','/reports'],
    ['Settings','/settings']
  ]
  return (
    <aside className="w-60 bg-gray-800 text-white min-h-screen p-4">
      <h2 className="text-xl font-bold mb-6">WorkZen Admin</h2>
      <nav className="flex flex-col gap-2">
        {links.map(([label, to]) => (
          <NavLink key={to} to={to} className={({isActive})=>isActive? 'bg-gray-700 p-2 rounded':'p-2 rounded hover:bg-gray-700'}>{label}</NavLink>
        ))}
      </nav>
    </aside>
  )
}
export default Sidebar
