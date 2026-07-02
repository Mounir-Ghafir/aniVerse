import { Link, NavLink } from "react-router-dom"

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">Ani<span>Verse</span></Link>
      <ul className="navbar-links">
        <li><NavLink to="/" className={({ isActive }) => isActive ? "active" : ""} end>Home</NavLink></li>
        <li><NavLink to="/anime" className={({ isActive }) => isActive ? "active" : ""}>Anime</NavLink></li>
        <li><NavLink to="/characters" className={({ isActive }) => isActive ? "active" : ""}>Characters</NavLink></li>
        <li><NavLink to="/favorites" className={({ isActive }) => isActive ? "active" : ""}>Favorites</NavLink></li>
        <li><NavLink to="/my-library" className={({ isActive }) => isActive ? "active" : ""}>My Library</NavLink></li>
        <li><NavLink to="/dashboard" className={({ isActive }) => isActive ? "active" : ""}>Dashboard</NavLink></li>
      </ul>
    </nav>
  )
}

export default Navbar
