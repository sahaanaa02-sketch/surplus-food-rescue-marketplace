import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    localStorage.setItem('token', 'mock-jwt-token');
    localStorage.setItem('role', role);
    navigate(role === 'business' ? '/business' : '/customer');
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleRegister} style={styles.card}>
        <h2>Create Account</h2>
        <input type="text" placeholder="Full Name / Restaurant Name" value={name} onChange={(e) => setName(e.target.value)} required style={styles.input} />
        <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required style={styles.input} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required style={styles.input} />
        <select value={role} onChange={(e) => setRole(e.target.value)} style={styles.input}>
          <option value="customer">Customer (Buy Food)</option>
          <option value="business">Business (Post Food)</option>
        </select>
        <button type="submit" style={styles.btn}>Register</button>
        <p style={{ marginTop: '15px', color: '#aaa' }}>
          Already have an account? <Link to="/login" style={{ color: '#1DB954' }}>Login</Link>
        </p>
      </form>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', backgroundColor: '#121212' },
  card: { backgroundColor: '#1e1e1e', padding: '30px', borderRadius: '8px', width: '100%', maxWidth: '400px', color: '#fff', textAlign: 'center' },
  input: { width: '100%', padding: '10px', margin: '10px 0', borderRadius: '4px', border: '1px solid #333', backgroundColor: '#2a2a2a', color: '#fff', boxSizing: 'border-box' },
  btn: { width: '100%', padding: '12px', backgroundColor: '#1DB954', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }
};