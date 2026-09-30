import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { api } from "../api";
import { useAuth, homeFor } from "../context/AuthContext";
import { LogoMark } from "../components/Navbar";
import { PHOTO } from "../components/OfferCard";
import { C, S } from "../theme";

const allowed = {
  customer: ["/offers", "/my-reservations"],
  food_owner: ["/dashboard", "/reports"],
  admin: ["/admin", "/reports"],
};

export default function Auth({ mode }) {
  const isReg = mode === "register";
  const [f, setF] = useState({ username: "", email: "", full_name: "", password: "", role: "customer" });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const set = k => e => setF({ ...f, [k]: e.target.value });

  function validate() {
    if (!f.username.trim()) return isReg ? "Enter a username" : "Enter your username or email";
    if (!f.password) return "Enter your password";
    if (isReg) {
      if (!/^\S+@\S+\.\S+$/.test(f.email)) return "Enter a valid email address";
      if (!f.full_name.trim()) return "Enter your full name";
      if (f.password.length < 6) return "Password must be at least 6 characters";
    }
    return "";
  }

  async function submit() {
    const v = validate();
    if (v) return setErr(v);
    setErr("");
    setBusy(true);
    try {
      if (isReg) {
        try {
          await api.register({ ...f, username: f.username.trim(), email: f.email.trim() });
        } catch (e) {
          if (/already exists/i.test(e.message))
            throw new Error("This username or email is already registered. Please login, or use a different one (tip: name+shop@gmail.com works as a new email).");
          throw e;
        }
      }
      const u = await login(f.username.trim(), f.password);
      const from = loc.state?.from;
      nav(from && allowed[u.role]?.includes(from) ? from : homeFor(u.role));
    } catch (e) {
      setErr(e.message === "Failed to fetch" ? "Cannot reach server. Is the backend running on port 8000?" : e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ ...S.page, maxWidth: 1000 }}>
      <div className="auth-grid" style={{ ...S.card, padding: 0, overflow: "hidden", marginTop: 10 }}>
        {/* photo side */}
        <div className="hide-md" style={{ position: "relative", background: `url(${PHOTO.restaurant}) center/cover` }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #0b121055, #0b1210ee)" }} />
          <div style={{ position: "absolute", bottom: 30, left: 30, right: 30 }}>
            <h2 style={{ margin: "0 0 8px", fontSize: 28 }}>Rescue tonight's <span style={{ color: C.green }}>surplus</span></h2>
            <p style={{ color: "#b5cbbf", margin: 0 }}>Discounted meals from local kitchens, reserved in three clicks.</p>
          </div>
        </div>

        {/* form side */}
        <div style={{ padding: 36, display: "grid", gap: 14, alignContent: "center" }}>
          <div style={{ textAlign: "center" }}><LogoMark size={54} /></div>
          <h2 style={{ margin: 0, textAlign: "center" }}>{isReg ? "Create your account" : "Welcome back"}</h2>

          {isReg && (
            <div style={{ display: "flex", gap: 10 }}>
              {[["customer", "🛒 Customer"], ["food_owner", "🏪 Food Business"]].map(([v, l]) => (
                <button key={v} type="button" onClick={() => setF({ ...f, role: v })}
                  style={{ ...(f.role === v ? S.btn : S.btnGhost), flex: 1 }}>{l}</button>
              ))}
            </div>
          )}

          <input style={S.input} placeholder={isReg ? "Username" : "Username or Email"} value={f.username} onChange={set("username")} />
          {isReg && (
            <>
              <input style={S.input} placeholder="Email" value={f.email} onChange={set("email")} />
              <input style={S.input} placeholder="Full name" value={f.full_name} onChange={set("full_name")} />
            </>
          )}
          <input style={S.input} type="password" placeholder="Password" value={f.password}
            onChange={set("password")} onKeyDown={e => e.key === "Enter" && submit()} />

          {err && <div style={{ color: C.red, fontSize: 14 }}>{err}</div>}

          <button style={S.btn} disabled={busy} onClick={submit}>
            {busy ? "Please wait..." : isReg ? "Register" : "Login"}
          </button>
          <small style={{ color: C.muted, textAlign: "center" }}>
            {isReg
              ? <Link style={{ color: C.green }} to="/login">Already have an account? Login</Link>
              : <Link style={{ color: C.green }} to="/register">New here? Register</Link>}
          </small>
        </div>
      </div>
    </div>
  );
}