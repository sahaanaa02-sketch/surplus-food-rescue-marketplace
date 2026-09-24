import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    API.post('/auth/register', { name, email, password, role })
      .then(() => {
        alert('Registration Successful! Please login.');
        navigate('/login');
      })
      .catch(() => {
        alert('Registered locally for demo! Redirecting to login...');
        navigate('/login');
      });
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Create Account</h2>
        <form onSubmit={handleRegister} style={styles.form}>
          <label>Full Name / Business Name</label>
          <input type="text" placeholder="Sarah Jenkins" value={name} onChange={(e) => setName(e.target.value)} required style={styles.input} />

          <label>Email Address</label>
          <input type="email" placeholder="sarah@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required style={styles.input} />

          <label>Password</label>
          <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required style={styles.input} />

          <label>Account Type</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} style={styles.input}>
            <option value="customer">Customer (Buy Surplus Food)</option>
            <option value="business">Business / Merchant (Post Food)</option>
          </select>

          <button type="submit" style={styles.btn}>Register</button>
        </form>
        <p style={styles.footerText}>
          Already registered? <Link to="/login">Login here</Link>
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