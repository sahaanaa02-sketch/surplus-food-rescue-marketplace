import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth, homeFor } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Offers from "./pages/Offers";
import MyReservations from "./pages/MyReservations";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import Admin from "./pages/AdminTemp";

// login illa na -> login (vandha page ah ninaivu vachukkum)
// thappaana role na -> avanga home page ku
function Guard({ role, children }) {
  const { user } = useAuth();
  const loc = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: loc.pathname }} replace />;
  if (!role.includes(user.role)) return <Navigate to={homeFor(user.role)} replace />;
  return children;
}

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Auth mode="login" />} />
        <Route path="/register" element={<Auth mode="register" />} />
        <Route path="/offers" element={<Guard role={["customer"]}><Offers /></Guard>} />
        <Route path="/my-reservations" element={<Guard role={["customer"]}><MyReservations /></Guard>} />
        <Route path="/dashboard" element={<Guard role={["food_owner"]}><Dashboard /></Guard>} />
        <Route path="/reports" element={<Guard role={["food_owner", "admin"]}><Reports /></Guard>} />
        <Route path="/admin" element={<Guard role={["admin"]}><Admin /></Guard>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}