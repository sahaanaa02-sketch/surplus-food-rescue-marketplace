import React, { useState } from 'react';
import CSVUploadModal from '../components/CSVUploadModal';

export default function BusinessDashboard() {
  const [showCSVModal, setShowCSVModal] = useState(false);
  const [items, setItems] = useState([
    { id: 1, title: 'Fresh Bakery Box', price: 250, qty: 3, status: 'Active' },
    { id: 2, title: 'Pasta Special', price: 300, qty: 2, status: 'Active' }
  ]);

  return (
    <div style={styles.container}>
      <h2>Merchant Portal</h2>
      <button style={styles.csvBtn} onClick={() => setShowCSVModal(true)}>
        📁 Import Offers via CSV
      </button>

      <div style={styles.tableContainer}>
        <h3>Your Active Offerings</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Price (Rs.)</th>
              <th>Qty</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td>{item.title}</td>
                <td>{item.price}</td>
                <td>{item.qty}</td>
                <td><span style={{ color: '#1DB954' }}>{item.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showCSVModal && <CSVUploadModal onClose={() => setShowCSVModal(false)} />}
    </div>
  );
}

const styles = {
  container: { padding: '30px', backgroundColor: '#121212', color: '#fff', minHeight: '90vh' },
  csvBtn: { backgroundColor: '#1DB954', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', marginBottom: '20px' },
  tableContainer: { backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '8px' },
  table: { width: '100%', borderCollapse: 'collapse', color: '#fff', marginTop: '10px' }
};