import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { C, S } from "../theme";

// Food logo: bowl + leaves. Auth.jsx and Landing.jsx kooda use pannum
export function LogoMark({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64">
      <rect width="64" height="64" rx="16" fill="#132a1d" stroke="#22c55e55" />
      <path d="M11 31h42c0 13-9 21-21 21S11 44 11 31z" fill="#22c55e" />
      <rect x="9" y="28" width="46" height="5" rx="2.5" fill="#86efac" />
      <path d="M32 25c-9-2-11-11-8-16 9 0 13 7 8 16z" fill="#4ade80" />
      <path d="M32 25c2-7 8-10 13-9-1 7-6 10-13 9z" fill="#16a34a" />
      <rect x="22" y="53" width="20" height="3" rx="1.5" fill="#22c55e88" />
    </svg>
  );
}

const roleLabel = { customer: "Customer", food_owner: "Business", admin: "Admin" };

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const link = ({ isActive }) => ({
    color: isActive ? C.green : C.muted, textDecoration: "none", fontWeight: 600, fontSize: 15,
  });

  return (
    <div style={{ position: "sticky", top: 0, zIndex: 20, background: "#0b1210ee", backdropFilter: "blur(10px)", borderBottom: `1px solid ${C.border}` }}>
      <div className="nav-inner" style={{ ...S.page, padding: "12px 24px" }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", marginRight: "auto" }}>
          <LogoMark />
          <span style={{ fontWeight: 800, fontSize: 20, color: C.text }}>
            ZeroWaste<span style={{ color: C.green }}>Bite</span>
          </span>
        </Link>

        {user?.role === "customer" && (
          <>
            <NavLink style={link} to="/offers">Offers</NavLink>
            <NavLink style={link} to="/my-reservations">My Reservations</NavLink>
          </>
        )}
        {user?.role === "food_owner" && (
          <>
            <NavLink style={link} to="/dashboard">Dashboard</NavLink>
            <NavLink style={link} to="/reports">Reports</NavLink>
          </>
        )}
        {user?.role === "admin" && (
          <>
            <NavLink style={link} to="/admin">Admin</NavLink>
            <NavLink style={link} to="/reports">Reports</NavLink>
          </>
        )}

        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span className="hide-md" style={{ color: C.muted, fontSize: 13 }}>
              {user.username} · {roleLabel[user.role] || user.role}
            </span>
            <button style={S.btnGhost} onClick={() => { logout(); nav("/"); }}>Logout</button>
          </div>
        ) : (
          <>
            <NavLink style={link} to="/login">Login</NavLink>
            <Link to="/register"><button style={S.btn}>Register</button></Link>
          </>
        )}
      </div>
    </div>
  );
}