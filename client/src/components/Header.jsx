import React from 'react';
import { Link } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';
import useAuth from '../hooks/useAuth';
import useAuthStore from '../store/authStore';
import './Header.css';

const Header = ({ title }) => {
  const { user } = useAuth();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <header className="header">
      <div className="header-left">
        <Link to="/" className="logo">
          🎨 Whiteboard
        </Link>
        {title && <h1>{title}</h1>}
      </div>
      <div className="header-right">
        {user && (
          <>
            <span className="user-info">{user.username}</span>
            <button onClick={handleLogout} className="logout-btn">
              <FiLogOut size={18} /> Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
