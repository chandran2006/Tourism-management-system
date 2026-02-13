import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaSun, FaMoon, FaUser, FaHeart, FaMapMarkedAlt, FaSignOutAlt } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, darkMode, toggleDarkMode } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <FaMapMarkedAlt /> Smart Tourist Guide
        </Link>
        
        <ul className="nav-menu">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/explore">Explore</Link></li>
          <li><Link to="/planner">Travel Planner</Link></li>
          {user && <li><Link to="/favorites">Favorites</Link></li>}
          {user?.role === 'admin' && <li><Link to="/admin">Admin</Link></li>}
        </ul>

        <div className="nav-actions">
          <button onClick={toggleDarkMode} className="icon-btn">
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
          
          {user ? (
            <>
              <span className="user-name"><FaUser /> {user.name}</span>
              <button onClick={handleLogout} className="btn-logout">
                <FaSignOutAlt /> Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="btn-login">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
