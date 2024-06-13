import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import './Header.css';

const Header = () => {
  const { auth, logout } = useContext(AuthContext);

  return (
    <div className="navbar">
      <Link to="/" className="logo">
        <img src="/path/to/logo.png" alt="Logo" />
      </Link>
      {auth ? (
        <button onClick={logout} className="auth-button">Đăng xuất</button>
      ) : (
        <Link to="/login" className="auth-button">Đăng nhập</Link>
      )}
    </div>
  );
};

export default Header;
