import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import Login from './components/Auth/Login';
import Phone from './components/Home/Phone';
import AuthProvider from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import Dashboard from './components/Dashboard/Dashboard';
import PrivateRoute from './utils/PrivateRoute';
import Listing from './components/Listing/Listing';

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="phone" element={<PrivateRoute><Phone /></PrivateRoute>} />
          <Route path="dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="listing" element={<PrivateRoute><Listing /></PrivateRoute>} />
        </Route>
      </Routes>
    </AuthProvider>
  );
};

export default App;
