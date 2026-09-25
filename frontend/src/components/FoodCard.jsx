import React from 'react';

export default function FoodCard({ offer, onReserve }) {
  return (
    <div style={styles.card}>
      <img src={offer.image_url} alt={offer.title} style={styles.image} />
      <div style={styles.body}>
        <span style={styles.badge}>{offer.category}</span>
        <h3 style={styles.title}>{offer.title}</h3>
        <p style={styles.business}>{offer.business_name}</p>
        
        <div style={styles.priceRow}>
          <div>
            <span style={styles.discountPrice}>₹{offer.discount_price}</span>
            <span style={styles.originalPrice}>₹{offer.original_price}</span>
          </div>
          <span style={styles.qty}>{offer.quantity} Left</span>
        </div>
        
        <p style={styles.time}>⏰ {offer.pickup_time}</p>
        
        <button onClick={onReserve} style={styles.btn}>
          Reserve Meal
        </button>
      </div>
    </div>
  );
}

const styles = {
  card: { backgroundColor: '#1e1e1e', borderRadius: '8px', overflow: 'hidden', display: 'flex', flexDirection: 'column' },
  image: { width: '100%', height: '160px', objectFit: 'cover' },
  body: { padding: '15px', display: 'flex', flexDirection: 'column', flex: '1' },
  badge: { backgroundColor: '#333', color: '#1DB954', fontSize: '11px', padding: '3px 8px', borderRadius: '4px', width: 'fit-content', marginBottom: '8px' },
  title: { margin: '0 0 5px 0', fontSize: '18px' },
  business: { color: '#aaa', fontSize: '13px', margin: '0 0 15px 0' },
  priceRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
  discountPrice: { fontSize: '20px', fontWeight: 'bold', color: '#1DB954', marginRight: '8px' },
  originalPrice: { fontSize: '14px', color: '#777', textDecoration: 'line-through' },
  qty: { fontSize: '12px', color: '#ff9800', backgroundColor: '#332a00', padding: '2px 6px', borderRadius: '4px' },
  time: { fontSize: '12px', color: '#bbb', marginBottom: '15px' },
  btn: { backgroundColor: '#1DB954', color: '#fff', border: 'none', padding: '10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', marginTop: 'auto' }
};