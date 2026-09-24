import React from 'react';

export default function FoodCard({ offer, onReserve }) {
  return (
    <div style={styles.card}>
      <div style={styles.imageContainer}>
        <img 
          src={offer.image_url || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500'} 
          alt={offer.title} 
          style={styles.image} 
        />
        <span style={styles.discountBadge}>
          {Math.round(((offer.original_price - offer.discount_price) / offer.original_price) * 100)}% OFF
        </span>
      </div>

      <div style={styles.content}>
        <h3 style={styles.title}>{offer.title}</h3>
        <p style={styles.business}>{offer.business_name || 'Local Bakery/Store'}</p>
        
        <div style={styles.detailsGroup}>
          <p style={styles.expiry}>⏰ Pick before: {offer.pickup_time || '8:00 PM'}</p>
          <p style={styles.quantity}>⚡ {offer.quantity} items left</p>
        </div>

        <div style={styles.priceRow}>
          <div>
            <span style={styles.discountPrice}>Rs. {offer.discount_price}</span>
            <span style={styles.originalPrice}>Rs. {offer.original_price}</span>
          </div>
          <button style={styles.reserveBtn} onClick={() => onReserve(offer)}>
            Reserve Now
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s',
    border: '1px solid #E5E7EB',
  },
  imageContainer: {
    position: 'relative',
    height: '160px',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  discountBadge: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    backgroundColor: '#EF4444',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  content: {
    padding: '16px',
  },
  title: {
    margin: '0 0 4px 0',
    fontSize: '18px',
    color: '#1F2937',
  },
  business: {
    margin: '0 0 12px 0',
    fontSize: '14px',
    color: '#6B7280',
  },
  detailsGroup: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
    color: '#4B5563',
    marginBottom: '16px',
    backgroundColor: '#F3F4F6',
    padding: '8px',
    borderRadius: '6px',
  },
  expiry: { margin: 0 },
  quantity: { margin: 0, fontWeight: '600', color: '#D97706' },
  priceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  discountPrice: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#10B981',
    marginRight: '8px',
  },
  originalPrice: {
    fontSize: '14px',
    textDecoration: 'line-through',
    color: '#9CA3AF',
  },
  reserveBtn: {
    backgroundColor: '#10B981',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer',
  }
};