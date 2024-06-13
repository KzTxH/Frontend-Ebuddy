import React, { useContext } from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import './Layout.css';

const Layout = () => {
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout-container">
      <header className="layout-header">
        <nav className="navbar">
          <div className="container">
            <Link className="navbar-brand" to="/">My App</Link>
            <div className="navbar-menu">
              <ul className="navbar">
                <li className="nav-item">
                  <Link className="nav-link" to="/">Home</Link>
                </li>
                {auth && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/dashboard">Dashboard</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/phone">Devices</Link>
                    </li>
                  </>
                )}
                {auth ? (
                  <li className="nav-item">
                    <button className="nav-link btn btn-link" onClick={handleLogout}>Logout</button>
                  </li>
                ) : (
                  <li className="nav-item">
                    <Link className="nav-link" to="/login">Login</Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </nav>
      </header>
      <main className="layout-content">
        <Outlet />
      </main>
      <footer className="layout-footer">
        <p>&copy; 2023 My App. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;
