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
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container">
            <Link className="navbar-brand" to="/">My App</Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/">Home</Link>
                </li>
                {auth ? (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/dashboard">Dashboard</Link>
                    </li>
                    <li className="nav-item">
                      <button className="nav-link btn btn-link" onClick={handleLogout}>Logout</button>
                    </li>
                  </>
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
      <footer className="layout-footer bg-dark text-white text-center py-3">
        <p>&copy; 2023 My App. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;
