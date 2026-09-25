import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>
        🥗 SurplusRescue
      </Link>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Home</Link>
        {token && role === 'customer' && <Link to="/customer" style={styles.link}>Offers</Link>}
        {token && role === 'business' && <Link to="/business" style={styles.link}>Merchant Portal</Link>}
        <Link to="/reports" style={styles.link}>Impact</Link>
        {!token ? (
          <>
            <Link to="/login" style={styles.loginBtn}>Login</Link>
            <Link to="/register" style={styles.registerBtn}>Register</Link>
          </>
        ) : (
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
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
    backgroundColor: '#121212',
    color: '#fff',
    flexWrap: 'wrap'
  },
  logo: { fontSize: '22px', fontWeight: 'bold', color: '#1DB954', textDecoration: 'none' },
  links: { display: 'flex', gap: '15px', alignItems: 'center' },
  link: { color: '#fff', textDecoration: 'none', fontSize: '15px' },
  loginBtn: { color: '#1DB954', textDecoration: 'none', border: '1px solid #1DB954', padding: '6px 12px', borderRadius: '4px' },
  registerBtn: { backgroundColor: '#1DB954', color: '#fff', padding: '6px 12px', borderRadius: '4px', textDecoration: 'none' },
  logoutBtn: { backgroundColor: '#e74c3c', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }
};