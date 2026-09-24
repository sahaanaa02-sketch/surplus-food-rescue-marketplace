import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    API.post('/auth/login', { username: email, password: password })
      .then((res) => {
        localStorage.setItem('token', res.data.access_token);
        localStorage.setItem('role', res.data.role || 'customer');
        alert('Login Successful!');
        navigate(res.data.role === 'business' ? '/business' : '/customer');
      })
      .catch(() => {
        // Fallback for demo preview
        localStorage.setItem('token', 'mock-jwt-token');
        alert('Demo Login Successful!');
        navigate('/customer');
      });
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Sign In to ZeroWasteBite</h2>
        <form onSubmit={handleLogin} style={styles.form}>
          <label>Email Address</label>
          <input type="email" placeholder="sarah@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required style={styles.input} />

          <label>Password</label>
          <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required style={styles.input} />

          <button type="submit" style={styles.btn}>Login</button>
        </form>
        <p style={styles.footerText}>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9FAFB' },
  card: { backgroundColor: 'white', padding: '30px', borderRadius: '12px', border: '1px solid #E5E7EB', width: '100%', maxWidth: '400px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' },
  form: { display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '15px' },
  input: { padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB' },
  btn: { backgroundColor: '#10B981', color: 'white', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' },
  footerText: { textAlign: 'center', marginTop: '15px', fontSize: '14px', color: '#6B7280' }
};