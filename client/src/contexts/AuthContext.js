import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';
const API_BASE_URL = config.apiUrl;

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const expirationTime = localStorage.getItem('tokenExpiration');
    if (token && expirationTime && new Date().getTime() < expirationTime) {
      setAuth(token);
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('tokenExpiration');
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        username,
        password,
      });
      const expirationTime = new Date().getTime() + 360 * 24 * 60 * 60 * 1000; // 60 phút
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('tokenExpiration', expirationTime);
      setAuth(res.data.token);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiration');
    setAuth(null);
  };

  return (
    <AuthContext.Provider value={{ auth, loading, setAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
