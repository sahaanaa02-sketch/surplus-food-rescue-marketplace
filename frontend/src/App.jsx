import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CustomerDashboard from './pages/CustomerDashboard';
import BusinessDashboard from './pages/BusinessDashboard';
import ReportsPage from './pages/ReportsPage';
import Navbar from './components/Navbar';

// Protected Route Component for Business Role
function BusinessRoute({ children }) {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  // லாக்-இன் செய்யவில்லை என்றாலோ அல்லது Customer-ஆக இருந்தாலோ Business Dashboard-க்குள் அனுமதிக்காது
  if (!token || role !== 'business') {
    alert('Access Denied: Only Business Merchants can access the Merchant Portal!');
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/customer" element={<CustomerDashboard />} />
        
        {/* Business Dashboard Protected Route */}
        <Route 
          path="/business" 
          element={
            <BusinessRoute>
              <BusinessDashboard />
            </BusinessRoute>
          } 
        />
        
        <Route path="/reports" element={<ReportsPage />} />
      </Routes>
    </Router>
  );
}

export default App;