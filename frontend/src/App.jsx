import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CustomerDashboard from './pages/CustomerDashboard';
import BusinessDashboard from './pages/BusinessDashboard';
import ReportsPage from './pages/ReportsPage';

const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role') || 'customer';

  if (!token) return <Navigate to="/login" replace />;
  if (allowedRole && userRole !== allowedRole) {
    return <Navigate to={userRole === 'business' ? '/business' : '/customer'} replace />;
  }
  return children;
};

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/customer" 
          element={
            <ProtectedRoute allowedRole="customer">
              <CustomerDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/business" 
          element={
            <ProtectedRoute allowedRole="business">
              <BusinessDashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="/reports" element={<ReportsPage />} />
      </Routes>
    </Router>
  );
}