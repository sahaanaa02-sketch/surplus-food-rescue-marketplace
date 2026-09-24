import React, { useState, useEffect } from 'react';
import API from '../services/api';
import CSVUploadModal from '../components/CSVUploadModal';

export default function BusinessDashboard() {
  const [offers, setOffers] = useState([]);
  const [showCSVModal, setShowCSVModal] = useState(false);
  
  // New Offer Form State
  const [title, setTitle] = useState('');
  const [origPrice, setOrigPrice] = useState('');
  const [discPrice, setDiscPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [pickupTime, setPickupTime] = useState('');

  const initialBusinessOffers = [
    { id: 1, title: 'Fresh Bakery Box', original_price: 500, discount_price: 250, quantity: 3, pickup_time: '8:00 PM', status: 'Active' },
    { id: 2, title: 'Wok-Fried Combo', original_price: 600, discount_price: 310, quantity: 3, pickup_time: '8:30 PM', status: 'Active' },
    { id: 3, title: 'Groceries Bundle', original_price: 580, discount_price: 290, quantity: 3, pickup_time: '9:00 PM', status: 'Active' },
  ];

  const fetchOffers = () => {
    API.get('/offers/my-offers')
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setOffers(res.data);
        } else {
          setOffers(initialBusinessOffers);
        }
      })
      .catch(() => setOffers(initialBusinessOffers));
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleAddOffer = (e) => {
    e.preventDefault();
    const newOffer = {
      title,
      original_price: parseFloat(origPrice),
      discount_price: parseFloat(discPrice),
      quantity: parseInt(quantity),
      pickup_time: pickupTime,
      status: 'Active'
    };

    API.post('/offers/', newOffer)
      .then(() => {
        alert('Offer Added Successfully!');
        fetchOffers();
        resetForm();
      })
      .catch(() => {
        alert('Offer added locally!');
        setOffers([...offers, { id: Date.now(), ...newOffer }]);
        resetForm();
      });
  };

  const resetForm = () => {
    setTitle(''); setOrigPrice(''); setDiscPrice(''); setQuantity(''); setPickupTime('');
  };

  return (
    <div style={styles.container}>
      {/* Top Business Metrics */}
      <div style={styles.metricsRow}>
        <div style={styles.metricCard}>
          <h3>📦 Total Rescued Packs</h3>
          <p style={styles.metricValue}>128 Packs</p>
        </div>
        <div style={styles.metricCard}>
          <h3>💰 Revenue Saved</h3>
          <p style={styles.metricValue}>Rs. 32,000</p>
        </div>
        <div style={styles.metricCard}>
          <h3>🟢 Active Listings</h3>
          <p style={styles.metricValue}>{offers.length} Items</p>
        </div>
      </div>

      <div style={styles.layout}>
        {/* Left Form: Create New Offer */}
        <div style={styles.formContainer}>
          <h2>+ Create New Food Offer</h2>
          <form onSubmit={handleAddOffer} style={styles.form}>
            <label>Food Item Title</label>
            <input type="text" placeholder="e.g., Fresh Croissants Box" value={title} onChange={(e) => setTitle(e.target.value)} required style={styles.input} />

            <div style={styles.row}>
              <div>
                <label>Original Price (Rs.)</label>
                <input type="number" placeholder="500" value={origPrice} onChange={(e) => setOrigPrice(e.target.value)} required style={styles.input} />
              </div>
              <div>
                <label>Offer Price (Rs.)</label>
                <input type="number" placeholder="250" value={discPrice} onChange={(e) => setDiscPrice(e.target.value)} required style={styles.input} />
              </div>
            </div>

            <div style={styles.row}>
              <div>
                <label>Available Quantity</label>
                <input type="number" placeholder="5" value={quantity} onChange={(e) => setQuantity(e.target.value)} required style={styles.input} />
              </div>
              <div>
                <label>Pickup Before</label>
                <input type="text" placeholder="8:00 PM" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} required style={styles.input} />
              </div>
            </div>

            <button type="submit" style={styles.submitBtn}>Post Surplus Offer</button>
          </form>
        </div>

        {/* Right Table: Active Offers & Actions */}
        <div style={styles.tableContainer}>
          <div style={styles.tableHeaderGroup}>
            <h2>Manage Active Offers</h2>
            <button style={styles.csvBtn} onClick={() => setShowCSVModal(true)}>
              📄 Bulk CSV Import
            </button>
          </div>

          <table style={styles.table}>
            <thead>
              <tr style={styles.trHeader}>
                <th>Title</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Pickup Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {offers.map((item) => (
                <tr key={item.id} style={styles.trRow}>
                  <td><strong>{item.title}</strong></td>
                  <td>Rs. {item.discount_price} <small style={{ textDecoration: 'line-through', color: '#9CA3AF' }}>Rs. {item.original_price}</small></td>
                  <td>{item.quantity} packs</td>
                  <td>{item.pickup_time}</td>
                  <td><span style={styles.statusBadge}>{item.status || 'Active'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showCSVModal && (
        <CSVUploadModal
          onClose={() => setShowCSVModal(false)}
          onSuccess={fetchOffers}
        />
      )}
    </div>
  );
}

const styles = {
  container: { backgroundColor: '#F9FAFB', minHeight: '100vh', padding: '30px 40px' },
  metricsRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' },
  metricCard: { backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', border: '1px solid #E5E7EB' },
  metricValue: { fontSize: '26px', fontWeight: 'bold', color: '#10B981', margin: '10px 0 0 0' },
  layout: { display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' },
  formContainer: { backgroundColor: 'white', padding: '25px', borderRadius: '12px', border: '1px solid #E5E7EB', height: 'fit-content' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
  input: { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB', marginTop: '5px' },
  submitBtn: { backgroundColor: '#10B981', color: 'white', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' },
  tableContainer: { backgroundColor: 'white', padding: '25px', borderRadius: '12px', border: '1px solid #E5E7EB' },
  tableHeaderGroup: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  csvBtn: { backgroundColor: '#059669', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' },
  table: { width: '100%', borderCollapse: 'collapse' },
  trHeader: { backgroundColor: '#F3F4F6', textAlign: 'left', borderBottom: '2px solid #E5E7EB' },
  trRow: { borderBottom: '1px solid #E5E7EB', height: '50px' },
  statusBadge: { backgroundColor: '#D1FAE5', color: '#065F46', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }
};