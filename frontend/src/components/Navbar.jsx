import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role'); // 'customer' or 'business'

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.brandGroup}>
        <Link to="/" style={styles.logo}>
          🌱 Surplus Rescue
        </Link>
        <span style={styles.badge}>Eco-Market</span>
      </div>

      <div style={styles.navLinks}>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/customer" style={styles.link}>Customer Dashboard</Link>
        <Link to="/business" style={styles.link}>Business Dashboard</Link>
        <Link to="/reports" style={styles.link}>Reports</Link>
        
        {token ? (
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.registerBtn}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 30px',
    backgroundColor: '#10B981',
    color: '#ffffff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  brandGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  logo: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#ffffff',
    textDecoration: 'none',
  },
  badge: {
    backgroundColor: '#059669',
    padding: '3px 8px',
    borderRadius: '12px',
    fontSize: '12px',
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  link: {
    color: '#ffffff',
    textDecoration: 'none',
    fontWeight: '500',
  },
  logoutBtn: {
    backgroundColor: '#EF4444',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  registerBtn: {
    backgroundColor: '#ffffff',
    color: '#10B981',
    padding: '8px 16px',
    borderRadius: '6px',
    textDecoration: 'none',
    fontWeight: 'bold',
  }
};