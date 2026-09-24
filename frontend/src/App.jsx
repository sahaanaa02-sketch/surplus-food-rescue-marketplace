import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CustomerDashboard from './pages/CustomerDashboard';
import BusinessDashboard from './pages/BusinessDashboard';
import ReportsPage from './pages/ReportsPage';
import Navbar from './components/Navbar';

// 🔒 Business Portal Protection Component
function BusinessRoute({ children }) {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  // 1. லாக்-இன் செய்யவில்லை என்றால் Login பக்கத்திற்கு திருப்பி விடும்
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. லாக்-இன் செய்தவர் Customer-ஆக இருந்தால் Access Denied காட்டி Customer Dashboard-க்கு திருப்பி விடும்
  if (role !== 'business') {
    alert('Access Denied: Business Account required to view Merchant Portal!');
    return <Navigate to="/customer" replace />;
  }

  return children;
}

// 🔒 Customer Portal Protection Component
function CustomerRoute({ children }) {
  const token = localStorage.getItem('token');

  // லாக்-இன் செய்யவில்லை என்றால் Login பக்கத்திற்கு திருப்பி விடும்
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* பொதுவான பக்கங்கள் (Public Routes) */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reports" element={<ReportsPage />} />

        {/* பாதுகாக்கப்பட்ட Customer பக்கம் (Protected Customer Route) */}
        <Route 
          path="/customer" 
          element={
            <CustomerRoute>
              <CustomerDashboard />
            </CustomerRoute>
          } 
        />
        
        {/* பாதுகாக்கப்பட்ட Business பக்கம் (Protected Business Route) */}
        <Route 
          path="/business" 
          element={
            <BusinessRoute>
              <BusinessDashboard />
            </BusinessRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;