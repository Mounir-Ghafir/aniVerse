import { Link, NavLink } from "react-router-dom"

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">Ani<span>Verse</span></Link>
      <div className="nav-links">
        <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} end>Home</NavLink>
        <NavLink to="/anime" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Anime</NavLink>
        <NavLink to="/characters" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Characters</NavLink>
        <NavLink to="/favorites" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Favorites</NavLink>
        <NavLink to="/my-library" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>My Library</NavLink>
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Dashboard</NavLink>
      </div>
      <div className="nav-search">
        <span className="search-icon">⌕</span>
        <input type="text" placeholder="Search anime..." />
      </div>
    </nav>
  )
}

export default Navbar
