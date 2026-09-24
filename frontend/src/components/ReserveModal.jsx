import React, { useState } from 'react';

export default function ReserveModal({ offer, onClose, onConfirm }) {
  const [quantity, setQuantity] = useState(1);

  if (!offer) return null;

  const handleIncrement = () => {
    if (quantity < offer.quantity) setQuantity(quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2>Reserve Surplus Food</h2>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div style={styles.body}>
          <h3>{offer.title}</h3>
          <p style={styles.priceInfo}>Price per item: <strong>Rs. {offer.discount_price}</strong></p>

          <div style={styles.quantityControl}>
            <span>Select Quantity:</span>
            <div style={styles.counterGroup}>
              <button style={styles.counterBtn} onClick={handleDecrement}>-</button>
              <span style={styles.quantityCount}>{quantity}</span>
              <button style={styles.counterBtn} onClick={handleIncrement}>+</button>
            </div>
          </div>

          <div style={styles.impactBox}>
            🌱 By rescuing {quantity} item(s), you save approx <strong>{(quantity * 0.5).toFixed(1)} kg CO2e</strong>!
          </div>

          <div style={styles.totalRow}>
            <span>Total Payable:</span>
            <span style={styles.totalPrice}>Rs. {quantity * offer.discount_price}</span>
          </div>
        </div>

        <div style={styles.footer}>
          <button style={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button 
            style={styles.confirmBtn} 
            onClick={() => onConfirm(offer.id, quantity)}
          >
            Confirm Reservation
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '12px',
    width: '90%',
    maxWidth: '450px',
    padding: '20px',
    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #E5E7EB',
    paddingBottom: '10px',
  },
  closeBtn: {
    background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer',
  },
  body: { padding: '15px 0' },
  priceInfo: { color: '#4B5563', marginBottom: '15px' },
  quantityControl: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  counterGroup: { display: 'flex', alignItems: 'center', gap: '12px' },
  counterBtn: {
    width: '32px', height: '32px', borderRadius: '6px',
    border: '1px solid #D1D5DB', backgroundColor: '#F3F4F6',
    fontSize: '18px', fontWeight: 'bold', cursor: 'pointer',
  },
  quantityCount: { fontSize: '18px', fontWeight: 'bold' },
  impactBox: {
    backgroundColor: '#D1FAE5', color: '#065F46',
    padding: '12px', borderRadius: '8px', fontSize: '14px',
    marginBottom: '20px',
  },
  totalRow: {
    display: 'flex', justifyContent: 'space-between',
    fontSize: '18px', fontWeight: 'bold', color: '#1F2937',
  },
  totalPrice: { color: '#10B981' },
  footer: {
    display: 'flex', gap: '10px', justifyContent: 'flex-end',
    borderTop: '1px solid #E5E7EB', paddingTop: '15px',
  },
  cancelBtn: {
    padding: '10px 18px', borderRadius: '6px', border: '1px solid #D1D5DB',
    backgroundColor: 'white', cursor: 'pointer',
  },
  confirmBtn: {
    padding: '10px 18px', borderRadius: '6px', border: 'none',
    backgroundColor: '#10B981', color: 'white', fontWeight: 'bold', cursor: 'pointer',
  }
};