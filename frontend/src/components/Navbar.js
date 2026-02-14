import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { FaSun, FaMoon, FaUser, FaHeart, FaMapMarkedAlt, FaSignOutAlt, FaLanguage } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, darkMode, toggleDarkMode } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
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
          <li><Link to="/">{t('home')}</Link></li>
          <li><Link to="/explore">{t('explore')}</Link></li>
          <li><Link to="/planner">{t('planner')}</Link></li>
          <li><Link to="/timeline">Timeline</Link></li>
          {user && <li><Link to="/favorites">{t('favorites')}</Link></li>}
          {user?.role === 'admin' && <li><Link to="/admin-dashboard">Dashboard</Link></li>}
        </ul>

        <div className="nav-actions">
          <button onClick={toggleLanguage} className="icon-btn" title="Language">
            <FaLanguage /> {language.toUpperCase()}
          </button>
          <button onClick={toggleDarkMode} className="icon-btn">
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
          
          {user ? (
            <>
              <span className="user-name" onClick={() => navigate('/profile')} style={{cursor: 'pointer'}}>
                <FaUser /> {user.name}
              </span>
              <button onClick={handleLogout} className="btn-logout">
                <FaSignOutAlt /> {t('logout')}
              </button>
            </>
          ) : (
            <Link to="/login" className="btn-login">{t('login')}</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
