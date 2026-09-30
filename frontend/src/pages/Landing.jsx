import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth, homeFor } from "../context/AuthContext";
import OfferCard, { FoodImg, PHOTO, CATS, CAT_EMOJI } from "../components/OfferCard";
import { LogoMark } from "../components/Navbar";
import { C, S } from "../theme";

const heroCards = [
  ["croissant", "Bakery", "Fresh Bakery Box", "₹250", "-50%", "-4deg", "0s", { left: "0%", top: "0%" }],
  ["pizza", "Meals", "Pizza Combo", "₹550", "-50%", "3deg", "0.7s", { left: "50%", top: "6%" }],
  ["salad", "Meals", "Garden Salads", "₹270", "-50%", "3deg", "1.3s", { left: "4%", top: "50%" }],
  ["cake", "Desserts", "Cake Slice Pack", "₹200", "-55%", "-3deg", "1.9s", { left: "52%", top: "56%" }],
];

const steps = [
  ["bread", "Bakery", "1. Find Unsold Meals", "Top local bakeries and restaurants post their daily extra food at 50%+ discount."],
  ["kitchen", "Meals", "2. Reserve in App", "Lock your order in just 3 clicks through our fast reservation checkout system."],
  ["meal", "Meals", "3. Collect & Enjoy", "Show your booking ID at the store counter during pickup time and enjoy your meal!"],
];

const catPhoto = { Bakery: "bread", Meals: "curry", Groceries: "grocery", Desserts: "cake" };

const why = [
  ["♻️", "Less food waste", "Every reserved pack is food that never reaches the bin."],
  ["💸", "Real savings", "Restaurant-quality food at night-time prices."],
  ["🏪", "Help local business", "Shops recover cost on unsold stock and reach new customers."],
  ["⏱️", "Clear pickup windows", "Fixed time slots and expiry, so plans never clash."],
];

const wrap = { ...S.page, padding: "72px 24px" };
const h2 = { fontSize: 34, margin: "0 0 8px", textAlign: "center" };
const sub = { color: C.muted, textAlign: "center", margin: "0 auto 40px", maxWidth: 560 };

export default function Landing() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [offers, setOffers] = useState([]);

  // offers endpoint public, athanaala login illaamale live deals kaattalaam
  useEffect(() => { api.offers().then(d => setOffers(d || [])).catch(() => {}); }, []);

  const live = offers.filter(o => new Date(o.pickup_end) > new Date() && o.quantity > 0);
  const units = live.reduce((s, o) => s + o.quantity, 0);
  const avgOff = live.length
    ? Math.round(live.reduce((s, o) => s + (1 - o.discounted_price / o.original_price) * 100, 0) / live.length)
    : 0;
  const shops = new Set(live.map(o => o.pickup_location)).size;
  const stats = [
    [live.length || "—", "live offers tonight"],
    [units || "—", "meals available"],
    [avgOff ? `${avgOff}%` : "—", "average discount"],
    [shops || "—", "partner stores"],
  ];

  const primaryTo = user ? homeFor(user.role) : "/offers";
  const primaryText = user?.role === "customer" || !user ? "Explore Offers" : user.role === "admin" ? "Open Admin" : "Open Dashboard";

  return (
    <div>
      {/* HERO */}
      <div style={{ background: `linear-gradient(90deg, #0b1210 32%, #0b1210dd 58%, #0b1210aa 100%), url(${PHOTO.restaurant}) center/cover` }}>
        <div className="hero-grid" style={{ ...S.page, padding: "84px 24px" }}>
          <div>
            <span style={{ background: "#22c55e22", color: C.green, padding: "6px 14px", borderRadius: 99, fontWeight: 700, fontSize: 13 }}>
              🌙 Night-time surplus food deals
            </span>
            <h1 style={{ fontSize: "clamp(38px,6vw,62px)", margin: "18px 0" }}>
              Good food shouldn't <span style={{ color: C.green }}>go to waste.</span>
            </h1>
            <p style={{ color: "#b5cbbf", fontSize: 18, maxWidth: 500 }}>
              ZeroWasteBite connects you with local restaurants and bakeries selling unsold food at big discounts, just before closing time.
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 28, flexWrap: "wrap" }}>
              <button style={{ ...S.btn, padding: "14px 28px", fontSize: 16 }} onClick={() => nav(primaryTo)}>{primaryText}</button>
              {!user && (
                <Link to="/register"><button style={{ ...S.btnGhost, padding: "13px 26px", fontSize: 16 }}>Partner your store</button></Link>
              )}
            </div>
          </div>

          {/* 4 floating photo cards */}
          <div className="hero-art" style={{ position: "relative", height: 470 }}>
            {heroCards.map(([k, cat, name, price, off, rot, delay, pos]) => (
              <div key={name} className="float"
                style={{ position: "absolute", width: "46%", ...pos, "--r": rot, animationDelay: delay, background: C.card, border: `1px solid ${C.border}`, borderRadius: 18, overflow: "hidden", boxShadow: "0 24px 50px #000a" }}>
                <div style={{ height: 150 }}><FoodImg k={k} cat={cat} alt={name} /></div>
                <div style={{ padding: 12 }}>
                  <b style={{ fontSize: 14 }}>{name}</b>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                    <span style={{ color: C.green, fontWeight: 800 }}>{price}</span>
                    <span style={{ color: C.amber, fontSize: 12, fontWeight: 700 }}>{off}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* LIVE STATS */}
      <div style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, background: C.card }}>
        <div className="stat-grid" style={{ ...S.page, padding: "28px 24px", textAlign: "center" }}>
          {stats.map(([n, l]) => (
            <div key={l}>
              <div style={{ fontSize: 32, fontWeight: 800, color: C.green }}>{n}</div>
              <div style={{ color: C.muted, fontSize: 14 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* LIVE DEALS */}
      <div style={wrap}>
        <h2 style={h2}>Surplus food deals near you</h2>
        <p style={sub}>Real offers published by our partner stores, closing soon.</p>
        {live.length ? (
          <>
            <div className="cards-grid">
              {[...live].sort((a, b) => new Date(a.pickup_end) - new Date(b.pickup_end)).slice(0, 6).map(o => (
                <OfferCard key={o.id ?? o.offer_id} o={o} onReserve={() => nav("/offers")} />
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: 30 }}>
              <button style={S.btnGhost} onClick={() => nav("/offers")}>View all offers →</button>
            </div>
          </>
        ) : (
          <p style={{ color: C.muted, textAlign: "center" }}>No live offers right now. Check back tonight!</p>
        )}
      </div>

      {/* HOW IT WORKS */}
      <div style={{ background: C.card, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div style={wrap}>
          <h2 style={h2}>How it works</h2>
          <p style={sub}>Three simple steps from surplus to saved.</p>
          <div className="cards-grid">
            {steps.map(([k, cat, t, d]) => (
              <div key={t} className="lift" style={{ ...S.card, padding: 0, overflow: "hidden", background: C.bg }}>
                <div style={{ height: 190 }}><FoodImg k={k} cat={cat} alt={t} /></div>
                <div style={{ padding: 22 }}>
                  <h3 style={{ margin: "0 0 6px" }}>{t}</h3>
                  <p style={{ color: C.muted, margin: 0 }}>{d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CATEGORIES */}
      <div style={wrap}>
        <h2 style={h2}>What can you rescue?</h2>
        <p style={sub}>Fresh, delicious and heavily discounted.</p>
        <div className="cards-grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))" }}>
          {Object.entries(catPhoto).map(([cat, k]) => (
            <div key={cat} className="lift" onClick={() => nav("/offers")}
              style={{ position: "relative", height: 220, borderRadius: 16, overflow: "hidden", border: `1px solid ${C.border}`, cursor: "pointer" }}>
              <FoodImg k={k} cat={cat} alt={cat} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 40%, #000c)" }} />
              <div style={{ position: "absolute", bottom: 14, left: 16 }}>
                <div style={{ fontSize: 22 }}>{CAT_EMOJI[cat]}</div>
                <b style={{ fontSize: 18 }}>{cat}</b>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* WHY */}
      <div style={{ background: C.card, borderTop: `1px solid ${C.border}` }}>
        <div style={wrap}>
          <h2 style={h2}>Why ZeroWasteBite?</h2>
          <p style={sub}>Good for your wallet, your neighbourhood and the planet.</p>
          <div className="cards-grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))" }}>
            {why.map(([e, t, d]) => (
              <div key={t} style={{ display: "flex", gap: 14 }}>
                <div style={{ fontSize: 30, width: 54, height: 54, flex: "none", display: "grid", placeItems: "center", background: "#22c55e18", borderRadius: 14 }}>{e}</div>
                <div><b>{t}</b><p style={{ color: C.muted, margin: "4px 0 0", fontSize: 14 }}>{d}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PARTNER CTA */}
      {(!user || user.role === "food_owner") && (
        <div style={wrap}>
          <div style={{ borderRadius: 20, overflow: "hidden", border: `1px solid ${C.border}`, textAlign: "center", padding: "56px 24px", background: `linear-gradient(#0b1210cc, #0b1210ee), url(${PHOTO.kitchen}) center/cover` }}>
            <h2 style={{ ...h2, fontSize: 32 }}>Run a restaurant or bakery?</h2>
            <p style={sub}>Turn tonight's leftovers into revenue. Publish offers one by one or bulk import them from a CSV.</p>
            <button style={{ ...S.btn, padding: "14px 28px" }} onClick={() => nav(user ? "/dashboard" : "/register")}>
              {user ? "Go to Dashboard" : "Become a partner"}
            </button>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div style={{ borderTop: `1px solid ${C.border}`, padding: "28px 24px", textAlign: "center", color: C.muted, fontSize: 14 }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <LogoMark size={28} /><b style={{ color: C.text }}>ZeroWasteBite</b>
        </div>
        © 2026 ZeroWasteBite · Surplus Food Rescue Marketplace
      </div>
    </div>
  );
}