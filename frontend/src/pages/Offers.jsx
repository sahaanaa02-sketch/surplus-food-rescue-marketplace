import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import OfferCard, { CATS, CAT_EMOJI, FoodImg, info, isTonight, timeLeft, windowText } from "../components/OfferCard";
import Toast from "../components/Toast";
import { C, S, money } from "../theme";

const PAGE = 12;

export default function Offers() {
  const nav = useNavigate();
  const [offers, setOffers] = useState([]);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [sort, setSort] = useState("soon");
  const [onlyOpen, setOnlyOpen] = useState(true);
  const [tonight, setTonight] = useState(true);
  const [limit, setLimit] = useState(PAGE);
  const [sel, setSel] = useState(null);
  const [qty, setQty] = useState(1);
  const [popErr, setPopErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);

  const load = () => api.offers().then(d => setOffers(d || [])).catch(e => setMsg({ err: e.message }));
  useEffect(() => { load(); }, []);

  async function confirm() {
    setBusy(true);
    setPopErr("");
    try {
      const r = await api.reserve(sel.id, qty);
      nav("/my-reservations", {
        state: { flash: { ok: `Reserved ${qty} × ${sel.item}. Reservation ID: ${r.reservation_id ?? r.id}` } },
      });
    } catch (e) {
      setPopErr(e.message);   // "Only 1 remaining" maathiri backend message
      load();
    } finally {
      setBusy(false);
    }
  }

  const disc = o => (o.original_price - o.discounted_price) / o.original_price;
  const shown = offers
    .filter(o => !onlyOpen || (o.quantity > 0 && timeLeft(o.pickup_end)))
    .filter(o => !tonight || isTonight(o))
    .filter(o => cat === "All" || info(o).cat === cat)
    .filter(o => (o.item + " " + o.description + " " + o.pickup_location).toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) =>
      sort === "price" ? a.discounted_price - b.discounted_price :
      sort === "off" ? disc(b) - disc(a) :
      new Date(a.pickup_end) - new Date(b.pickup_end));

  const reset = fn => v => { fn(v); setLimit(PAGE); };
  const sInfo = sel ? info(sel) : null;
  const chk = { display: "flex", alignItems: "center", gap: 8, color: C.muted, fontSize: 14, cursor: "pointer" };

  return (
    <div style={S.page}>
      <Toast msg={msg} onClose={() => setMsg(null)} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", flexWrap: "wrap", gap: 12, marginBottom: 22 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 32 }}>Surplus deals <span style={{ color: C.green }}>tonight</span></h1>
          <p style={{ color: C.muted, margin: "6px 0 0" }}>{shown.length} offers available</p>
        </div>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          <label style={chk}><input type="checkbox" checked={tonight} onChange={e => reset(setTonight)(e.target.checked)} /> Tonight only</label>
          <label style={chk}><input type="checkbox" checked={onlyOpen} onChange={e => reset(setOnlyOpen)(e.target.checked)} /> Hide sold out / expired</label>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 14 }}>
        <input style={{ ...S.input, flex: 1, minWidth: 240 }} placeholder="🔍 Search food or place..." value={q} onChange={e => reset(setQ)(e.target.value)} />
        <select style={{ ...S.input, width: 200 }} value={sort} onChange={e => setSort(e.target.value)}>
          <option value="soon">Closing soonest</option>
          <option value="price">Lowest price</option>
          <option value="off">Biggest discount</option>
        </select>
      </div>

      <div className="chips" style={{ marginBottom: 26 }}>
        {["All", ...CATS].map(c => (
          <button key={c} onClick={() => reset(setCat)(c)}
            style={{ ...(cat === c ? S.btn : S.btnGhost), borderRadius: 99, padding: "8px 18px" }}>
            {c === "All" ? "All" : `${CAT_EMOJI[c]} ${c}`}
          </button>
        ))}
      </div>

      <div className="cards-grid">
        {shown.slice(0, limit).map(o => (
          <OfferCard key={o.id ?? o.offer_id} o={o} onReserve={x => { setSel(x); setQty(1); setPopErr(""); }} />
        ))}
      </div>

      {!shown.length && <p style={{ color: C.muted, textAlign: "center", marginTop: 60 }}>No offers found.</p>}
      {shown.length > limit && (
        <div style={{ textAlign: "center", marginTop: 34 }}>
          <button style={S.btnGhost} onClick={() => setLimit(limit + PAGE)}>Show more ({shown.length - limit} left)</button>
        </div>
      )}

      {sel && (
        <div onClick={() => setSel(null)} style={{ position: "fixed", inset: 0, background: "#000b", display: "grid", placeItems: "center", zIndex: 50, padding: 16 }}>
          <div onClick={e => e.stopPropagation()} style={{ ...S.card, width: 390, maxWidth: "100%", padding: 0, overflow: "hidden" }}>
            <div style={{ height: 150 }}><FoodImg srcs={sInfo.srcs} cat={sInfo.cat} alt={sel.item} /></div>
            <div style={{ padding: 22, display: "grid", gap: 12 }}>
              <h3 style={{ margin: 0 }}>{sel.item}</h3>
              <small style={{ color: C.muted }}>{sel.quantity} available · 📍 {sel.pickup_location}</small>
              <small style={{ color: C.muted }}>🕒 Pickup {windowText(sel)}</small>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20 }}>
                <button style={S.btnGhost} onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
                <b style={{ fontSize: 28, minWidth: 30, textAlign: "center" }}>{qty}</b>
                <button style={S.btnGhost} onClick={() => setQty(qty + 1)}>+</button>
              </div>
              <div style={{ textAlign: "center", color: C.green, fontWeight: 800, fontSize: 22 }}>
                Total {money(qty * sel.discounted_price)}
              </div>
              {popErr && <div style={{ color: C.red, fontSize: 14, textAlign: "center" }}>{popErr}</div>}
              <button style={S.btn} disabled={busy} onClick={confirm}>{busy ? "Reserving..." : "Confirm Reservation"}</button>
              <button style={S.btnGhost} onClick={() => setSel(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}