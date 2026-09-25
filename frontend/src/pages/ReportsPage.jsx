import React from 'react';

export default function ReportsPage() {
  return (
    <div style={styles.container}>
      <h2>Platform Environmental & Social Impact</h2>
      <div style={styles.grid}>
        <div style={styles.statCard}>
          <h3>1,250+ kg</h3>
          <p>Food Rescued</p>
        </div>
        <div style={styles.statCard}>
          <h3>3,100+ kg</h3>
          <p>CO₂ Emissions Prevented</p>
        </div>
        <div style={styles.statCard}>
          <h3>₹4,50,000+</h3>
          <p>Saved by Customers</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '30px', backgroundColor: '#121212', color: '#fff', minHeight: '90vh' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '20px' },
  statCard: { backgroundColor: '#1e1e1e', padding: '25px', borderRadius: '8px', textAlign: 'center', borderTop: '4px solid #1DB954' }
};