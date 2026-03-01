import { Link, NavLink } from 'react-router-dom'

export default function Navbar() {
  return (
    <header className="bg-blue-600 text-white shadow-soft">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl sm:text-2xl font-bold tracking-tight">JobSculptor</Link>
        <nav className="flex items-center gap-6">
          <NavLink to="/" end className={({ isActive }) =>
            `hover:text-blue-100 transition ${isActive ? 'font-semibold underline underline-offset-8' : ''}`
          }>Home</NavLink>
          <NavLink to="/analyze" className={({ isActive }) =>
            `hover:text-blue-100 transition ${isActive ? 'font-semibold underline underline-offset-8' : ''}`
          }>Resume Analyzer</NavLink>
        </nav>
      </div>
    </header>
  )
}
