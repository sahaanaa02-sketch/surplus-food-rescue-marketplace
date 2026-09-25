import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div style={styles.container}>
      {/* Hero Section with Visual Image Banner */}
      <div style={styles.heroSection}>
        <div style={styles.heroText}>
          <span style={styles.badge}>🌱 Save Food, Save Money</span>
          <h1 style={styles.title}>Delicious Surplus Food at Half Price</h1>
          <p style={styles.subtitle}>
            Connect with local bakeries, cafes, and restaurants to rescue fresh surplus meals before they go to waste.
          </p>
          <div style={styles.btnGroup}>
            <Link to="/customer" style={styles.primaryBtn}>Explore Offers</Link>
            <Link to="/register" style={styles.secondaryBtn}>Partner Your Store</Link>
          </div>
        </div>
        
        {/* Right Side Visual Image */}
        <div style={styles.heroImageWrapper}>
          <img 
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800" 
            alt="Delicious Surplus Meal" 
            style={styles.heroImage} 
          />
        </div>
      </div>

      {/* Visual Category / Feature Showcase Section */}
      <div style={styles.featureSection}>
        <h2 style={styles.sectionTitle}>How It Works</h2>
        <div style={styles.cardsGrid}>
          <div style={styles.card}>
            <img 
              src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400" 
              alt="Discover Food" 
              style={styles.cardImage} 
            />
            <div style={styles.cardBody}>
              <h3>1. Find Unsold Meals</h3>
              <p>Top local bakeries & restaurants post their daily extra fresh food at 50%+ discount.</p>
            </div>
          </div>

          <div style={styles.card}>
            <img 
              src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=400" 
              alt="Reserve Easily" 
              style={styles.cardImage} 
            />
            <div style={styles.cardBody}>
              <h3>2. Reserve in App</h3>
              <p>Lock your order in just 3 clicks through our fast reservation checkout system.</p>
            </div>
          </div>

          <div style={styles.card}>
            <img 
              src="https://images.unsplash.com/photo-1526367790999-0150786686a2?w=400" 
              alt="Pickup & Enjoy" 
              style={styles.cardImage} 
            />
            <div style={styles.cardBody}>
              <h3>3. Collect & Enjoy</h3>
              <p>Show your booking token at the store counter during pickup time and enjoy your meal!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#121212',
    color: '#fff',
    minHeight: '90vh',
    padding: '20px 40px'
  },
  heroSection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '40px',
    padding: '40px 0',
    flexWrap: 'wrap-reverse'
  },
  heroText: {
    flex: '1',
    minWidth: '300px'
  },
  badge: {
    backgroundColor: '#1e382b',
    color: '#1DB954',
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: 'bold',
    display: 'inline-block',
    marginBottom: '15px'
  },
  title: {
    fontSize: '46px',
    fontWeight: '800',
    lineHeight: '1.2',
    marginBottom: '20px'
  },
  subtitle: {
    fontSize: '18px',
    color: '#b3b3b3',
    lineHeight: '1.6',
    marginBottom: '30px'
  },
  btnGroup: {
    display: 'flex',
    gap: '15px',
    flexWrap: 'wrap'
  },
  primaryBtn: {
    backgroundColor: '#1DB954',
    color: '#fff',
    padding: '14px 28px',
    borderRadius: '30px',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '16px'
  },
  secondaryBtn: {
    backgroundColor: 'transparent',
    color: '#fff',
    border: '2px solid #333',
    padding: '14px 28px',
    borderRadius: '30px',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '16px'
  },
  heroImageWrapper: {
    flex: '1',
    minWidth: '300px',
    display: 'flex',
    justifyContent: 'center'
  },
  heroImage: {
    width: '100%',
    maxHeight: '420px',
    objectFit: 'cover',
    borderRadius: '16px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
  },
  featureSection: {
    marginTop: '60px',
    paddingBottom: '40px'
  },
  sectionTitle: {
    textAlign: 'center',
    fontSize: '32px',
    marginBottom: '30px',
    color: '#1DB954'
  },
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '25px'
  },
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: '12px',
    overflow: 'hidden',
    border: '1px solid #2a2a2a'
  },
  cardImage: {
    width: '100%',
    height: '180px',
    objectFit: 'cover'
  },
  cardBody: {
    padding: '20px'
  }
};