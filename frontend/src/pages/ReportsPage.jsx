import React from 'react';

export default function ReportsPage() {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>🌱 ZeroWasteBite Environmental Impact Report</h1>
        <p>Real-time analytics tracking food waste reduction and carbon footprint savings.</p>
      </div>

      {/* Top Summary Metrics */}
      <div style={styles.metricsGrid}>
        <div style={styles.metricCard}>
          <h3>🥗 Total Food Rescued</h3>
          <p style={styles.value}>450 kg</p>
          <span style={styles.subtext}>+18% from last week</span>
        </div>
        <div style={styles.metricCard}>
          <h3>☁️ Carbon Emission Offset</h3>
          <p style={styles.value}>900 kg CO2e</p>
          <span style={styles.subtext}>Equivalent to 40 trees planted</span>
        </div>
        <div style={styles.metricCard}>
          <h3>💵 Total Money Saved</h3>
          <p style={styles.value}>Rs. 145,000</p>
          <span style={styles.subtext}>For local community customers</span>
        </div>
        <div style={styles.metricCard}>
          <h3>🏪 Partner Merchants</h3>
          <p style={styles.value}>24 Stores</p>
          <span style={styles.subtext}>Active in Jaffna region</span>
        </div>
      </div>

      {/* Visual Analytics Sections */}
      <div style={styles.chartsGrid}>
        <div style={styles.chartCard}>
          <h2>Monthly Food Rescue Trends</h2>
          <div style={styles.mockBarChart}>
            <div style={{ ...styles.bar, height: '40%' }}><span>Jan</span></div>
            <div style={{ ...styles.bar, height: '55%' }}><span>Feb</span></div>
            <div style={{ ...styles.bar, height: '70%' }}><span>Mar</span></div>
            <div style={{ ...styles.bar, height: '90%', backgroundColor: '#10B981' }}><span>Apr</span></div>
          </div>
        </div>

        <div style={styles.chartCard}>
          <h2>Top Rescued Categories</h2>
          <ul style={styles.categoryList}>
            <li>🥐 <strong>Bakery & Pastries:</strong> 42% (189 kg)</li>
            <li>🍱 <strong>Prepared Meals & Combos:</strong> 35% (157.5 kg)</li>
            <li>🍎 <strong>Fresh Groceries & Produce:</strong> 23% (103.5 kg)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { backgroundColor: '#F9FAFB', minHeight: '100vh', padding: '40px 20px', maxWidth: '1100px', margin: '0 auto' },
  header: { textAlign: 'center', marginBottom: '35px' },
  metricsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '40px' },
  metricCard: { backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
  value: { fontSize: '28px', fontWeight: 'bold', color: '#10B981', margin: '10px 0 5px 0' },
  subtext: { fontSize: '12px', color: '#6B7280' },
  chartsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' },
  chartCard: { backgroundColor: 'white', padding: '25px', borderRadius: '12px', border: '1px solid #E5E7EB' },
  mockBarChart: { display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', height: '180px', marginTop: '20px', borderBottom: '2px solid #E5E7EB', paddingBottom: '10px' },
  bar: { width: '40px', backgroundColor: '#A7F3D0', borderRadius: '6px 6px 0 0', display: 'flex', justifyContent: 'center', alignItems: 'flex-end', paddingBottom: '5px', fontSize: '12px', color: '#065F46' },
  categoryList: { listStyle: 'none', padding: 0, marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px', fontSize: '16px' }
};