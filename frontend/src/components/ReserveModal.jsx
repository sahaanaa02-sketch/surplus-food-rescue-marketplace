import React, { useState } from 'react';

export default function ReserveModal({ offer, onClose }) {
  const [reserved, setReserved] = useState(false);

  const handleConfirm = () => {
    setReserved(true);
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {!reserved ? (
          <>
            <h3>Reserve Meal</h3>
            <p><strong>{offer.title}</strong> - {offer.business_name}</p>
            <p style={{ color: '#1DB954', fontSize: '18px', fontWeight: 'bold' }}>
              Price: ₹{offer.discount_price} <span style={{ textDecoration: 'line-through', color: '#888', fontSize: '14px' }}>₹{offer.original_price}</span>
            </p>
            <p style={{ color: '#aaa', fontSize: '14px' }}>Pickup Timeline: {offer.pickup_time}</p>
            
            <div style={styles.actions}>
              <button onClick={onClose} style={styles.cancelBtn}>Cancel</button>
              <button onClick={handleConfirm} style={styles.confirmBtn}>Confirm Reservation</button>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <h3 style={{ color: '#1DB954' }}>✅ Order Reserved Successfully!</h3>
            <p style={{ color: '#ccc' }}>Show this token at the store counter for pickup.</p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modal: { backgroundColor: '#1e1e1e', padding: '25px', borderRadius: '8px', width: '90%', maxWidth: '400px', color: '#fff' },
  actions: { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' },
  cancelBtn: { backgroundColor: '#333', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' },
  confirmBtn: { backgroundColor: '#1DB954', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }
};