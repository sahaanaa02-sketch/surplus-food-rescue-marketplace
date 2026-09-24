import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1>Rescue Good Food, Save Money & The Planet 🌍</h1>
        <p>Connect with local bakeries and restaurants in Jaffna to buy surplus food at up to 50% discount.</p>
        <div style={styles.btnGroup}>
          <Link to="/customer" style={styles.primaryBtn}>Explore Surplus Offers</Link>
          <Link to="/business" style={styles.secondaryBtn}>Merchant Portal</Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { backgroundColor: '#F9FAFB', minHeight: '85vh', display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '0 20px' },
  hero: { maxWidth: '700px' },
  btnGroup: { display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '25px' },
  primaryBtn: { backgroundColor: '#10B981', color: 'white', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' },
  secondaryBtn: { backgroundColor: '#374151', color: 'white', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }
};