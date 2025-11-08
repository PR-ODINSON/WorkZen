import React from 'react'
import { useNavigate } from 'react-router-dom'

const Navbar = ()=>{
  const nav = useNavigate()
  const logout = ()=>{
    localStorage.removeItem('token')
    nav('/login')
  }
  return (
    <header className="flex items-center justify-end mb-4">
      <div className="flex items-center gap-4">
        <button onClick={logout} className="bg-red-500 text-white px-3 py-1 rounded">Logout</button>
      </div>
    </header>
  )
}
export default Navbar
