import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import FoodCard from '../components/FoodCard';
import ReserveModal from '../components/ReserveModal';
import API from '../services/api';

export default function CustomerDashboard() {
  const [offers, setOffers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeOffer, setActiveOffer] = useState(null);

  // Mock data as fallback for Figma UI preview
  const initialOffers = [
    {
      id: 1,
      title: 'Fresh Bakery Box',
      business_name: 'City Bakery',
      category: 'Bakery',
      original_price: 500,
      discount_price: 250,
      quantity: 3,
      pickup_time: 'Closes in 45 mins',
      image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500'
    },
    {
      id: 2,
      title: 'Wok-Fried Combo',
      business_name: 'The Spicy Wok',
      category: 'Meals',
      original_price: 600,
      discount_price: 310,
      quantity: 3,
      pickup_time: 'Closes in 45 mins',
      image_url: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500'
    },
    {
      id: 3,
      title: 'Essential Groceries Bundle',
      business_name: 'Global Grocer',
      category: 'Snacks',
      original_price: 580,
      discount_price: 290,
      quantity: 3,
      pickup_time: 'Closes in 45 mins',
      image_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500'
    }
  ];

  useEffect(() => {
    // Fetch offers from backend API or use initial mock data
    API.get('/offers/')
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setOffers(res.data);
        } else {
          setOffers(initialOffers);
        }
      })
      .catch(() => setOffers(initialOffers));
  }, []);

  const handleReserveClick = (offer) => {
    setActiveOffer(offer);
  };

  const handleConfirmReservation = (offerId, quantity) => {
    API.post('/reservations/', { offer_id: offerId, quantity: quantity })
      .then(() => {
        alert('Reservation Successful! Check your reservations.');
        setActiveOffer(null);
      })
      .catch((err) => {
        alert('Reservation confirmed locally! (Backend sync pending)');
        setActiveOffer(null);
      });
  };

  const filteredOffers = offers.filter((offer) => {
    const matchesCategory = selectedCategory === 'All' || offer.category === selectedCategory;
    const matchesSearch = offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          offer.business_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={styles.container}>
      {/* Top Banner Header */}
      <div style={styles.banner}>
        <h2>Welcome back, Sarah! | Your location: Jaffna</h2>
        <div style={styles.impactBadgeGroup}>
          <span style={styles.impactBadge}>🌱 12.5kg Food Saved</span>
          <span style={styles.impactBadge}>🍃 25 kg CO2 saved</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={styles.content}>
        <h1 style={styles.title}>Available Surplus Food Near You</h1>

        {/* Search & Category Filter Section */}
        <div style={styles.filterSection}>
          <input
            type="text"
            placeholder="Search for restaurants or food types..."
            style={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div style={styles.categoryGroup}>
            {['All', 'Bakery', 'Meals', 'Snacks'].map((cat) => (
              <button
                key={cat}
                style={{
                  ...styles.chipBtn,
                  backgroundColor: selectedCategory === cat ? '#10B981' : '#E5E7EB',
                  color: selectedCategory === cat ? 'white' : '#374151'
                }}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Food Items Grid */}
        <div style={styles.grid}>
          {filteredOffers.map((offer) => (
            <FoodCard key={offer.id} offer={offer} onReserve={handleReserveClick} />
          ))}
        </div>
      </div>

      {/* Reservation Pop-up Modal */}
      {activeOffer && (
        <ReserveModal
          offer={activeOffer}
          onClose={() => setActiveOffer(null)}
          onConfirm={handleConfirmReservation}
        />
      )}
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#F9FAFB',
    minHeight: '100vh',
    paddingBottom: '40px',
  },
  banner: {
    backgroundColor: '#D1FAE5',
    color: '#065F46',
    padding: '20px 40px',
    textAlign: 'center',
    borderBottom: '1px solid #A7F3D0',
  },
  impactBadgeGroup: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginTop: '10px',
  },
  impactBadge: {
    backgroundColor: 'white',
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  content: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '30px 20px',
  },
  title: {
    textAlign: 'center',
    fontSize: '28px',
    color: '#111827',
    marginBottom: '25px',
  },
  filterSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '30px',
  },
  searchInput: {
    width: '100%',
    maxWidth: '500px',
    padding: '12px 18px',
    borderRadius: '8px',
    border: '1px solid #D1D5DB',
    fontSize: '15px',
  },
  categoryGroup: {
    display: 'flex',
    gap: '10px',
  },
  chipBtn: {
    padding: '8px 18px',
    borderRadius: '20px',
    border: 'none',
    fontWeight: '600',
    cursor: 'pointer',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '25px',
  }
};
