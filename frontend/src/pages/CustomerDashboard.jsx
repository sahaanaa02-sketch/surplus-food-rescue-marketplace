import React, { useState } from 'react';
import FoodCard from '../components/FoodCard';
import ReserveModal from '../components/ReserveModal';

const initialOffers = [
  { id: 1, title: 'Fresh Bakery Box', business_name: 'City Bakery', category: 'Bakery', original_price: 500, discount_price: 250, pickup_time: 'Closes in 30 mins', quantity: 3, image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500' },
  { id: 2, title: 'Wok Fried Combo', business_name: 'The Spicy Wok', category: 'Meals', original_price: 600, discount_price: 310, pickup_time: 'Closes in 45 mins', quantity: 2, image_url: 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=500' },
  { id: 3, title: 'Essential Groceries Bundle', business_name: 'Global Grocer', category: 'Snacks', original_price: 580, discount_price: 290, pickup_time: 'Closes in 1 hour', quantity: 5, image_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500' },
  { id: 4, title: 'Artisan Pizza Box', business_name: 'Pizza Hub', category: 'Meals', original_price: 800, discount_price: 400, pickup_time: 'Closes in 20 mins', quantity: 1, image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500' },
  { id: 5, title: 'Assorted Pastries', business_name: 'Sweet Treats', category: 'Bakery', original_price: 400, discount_price: 200, pickup_time: 'Closes in 50 mins', quantity: 4, image_url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500' },
  { id: 6, title: 'Sushi Roll Platter', business_name: 'Tokyo Dine', category: 'Meals', original_price: 1200, discount_price: 600, pickup_time: 'Closes in 15 mins', quantity: 2, image_url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500' },
  { id: 7, title: 'South Indian Thali', business_name: 'Sangeetha', category: 'Meals', original_price: 350, discount_price: 175, pickup_time: 'Closes in 30 mins', quantity: 6, image_url: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=500' },
  { id: 8, title: 'Fresh Fruit Basket', business_name: 'Farm Fresh Market', category: 'Snacks', original_price: 450, discount_price: 225, pickup_time: 'Closes in 2 hours', quantity: 3, image_url: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=500' },
  { id: 9, title: 'Gourmet Sandwich Set', business_name: 'Cafe Coffee Day', category: 'Snacks', original_price: 300, discount_price: 150, pickup_time: 'Closes in 40 mins', quantity: 4, image_url: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500' },
  { id: 10, title: 'Burger & Fries Combo', business_name: 'Burger Point', category: 'Meals', original_price: 550, discount_price: 275, pickup_time: 'Closes in 25 mins', quantity: 2, image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500' }
];

export default function CustomerDashboard() {
  const [offers] = useState(initialOffers);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');

  const filteredOffers = offers.filter(o => 
    (category === 'All' || o.category === category) &&
    o.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <h2 style={{ marginBottom: '20px' }}>Surplus Food Deals Near You</h2>
      <div style={styles.controls}>
        <input 
          type="text" 
          placeholder="Search food or restaurants..." 
          style={styles.search} 
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
        <div style={styles.cats}>
          {['All', 'Bakery', 'Meals', 'Snacks'].map(cat => (
            <button 
              key={cat} 
              style={{ ...styles.catBtn, backgroundColor: category === cat ? '#1DB954' : '#2a2a2a' }} 
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      <div style={styles.grid}>
        {filteredOffers.map(offer => (
          <FoodCard key={offer.id} offer={offer} onReserve={() => setSelectedOffer(offer)} />
        ))}
      </div>
      {selectedOffer && (
        <ReserveModal offer={selectedOffer} onClose={() => setSelectedOffer(null)} />
      )}
    </div>
  );
}

const styles = {
  container: { padding: '30px', backgroundColor: '#121212', color: '#fff', minHeight: '90vh' },
  controls: { display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '25px' },
  search: { flex: '1', minWidth: '250px', padding: '10px', borderRadius: '20px', border: '1px solid #333', backgroundColor: '#1e1e1e', color: '#fff' },
  cats: { display: 'flex', gap: '10px' },
  catBtn: { color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }
};