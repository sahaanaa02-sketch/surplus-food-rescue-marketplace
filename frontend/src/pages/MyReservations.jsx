import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { api, rid } from "../api";
import { FoodImg, info } from "../components/OfferCard";
import Toast, { ConfirmDialog } from "../components/Toast";
import { C, S, badge, money } from "../theme";

const col = { reserved: C.amber, collected: C.green, cancelled: C.red };
const TABS = ["all", "reserved", "collected", "cancelled"];

export default function MyReservations() {
  const loc = useLocation();
  const [rows, setRows] = useState([]);
  const [offers, setOffers] = useState({});
  const [tab, setTab] = useState("all");
  const [ask, setAsk] = useState(null);
  const [msg, setMsg] = useState(loc.state?.flash || null);

  const load = () => {
    api.myReservations().then(d => setRows((d || []).slice().reverse())).catch(e => setMsg({ err: e.message }));
    api.offers().then(d => setOffers(Object.fromEntries((d || []).map(o => [o.id, o])))).catch(() => {});
  };
  useEffect(() => { load(); window.history.replaceState({}, ""); }, []);

  async function cancel() {
    const r = ask;
    setAsk(null);
    try {
      await api.cancel(rid(r));
      setMsg({ ok: "Reservation cancelled. Stock restored." });
    } catch (e) {
      setMsg({ err: e.message });
    }
    load();
  }

  const shown = rows.filter(r => tab === "all" || r.status === tab);

  return (
    <div style={S.page}>
      <Toast msg={msg} onClose={() => setMsg(null)} />
      <ConfirmDialog open={!!ask} title="Cancel reservation?" text="The meals will go back to the shelf for other customers."
        yes="Yes, cancel" danger onYes={cancel} onNo={() => setAsk(null)} />

      <h1 style={{ margin: "0 0 6px", fontSize: 32 }}>My <span style={{ color: C.green }}>Reservations</span></h1>
      <p style={{ color: C.muted, margin: "0 0 22px" }}>Show your reservation ID at the store during the pickup window.</p>

      <div className="chips" style={{ marginBottom: 22 }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ ...(tab === t ? S.btn : S.btnGhost), borderRadius: 99, padding: "8px 18px", textTransform: "capitalize" }}>
            {t} ({t === "all" ? rows.length : rows.filter(r => r.status === t).length})
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gap: 14 }}>
        {shown.map(r => {
          const o = offers[r.offer_id];
          const inf = o ? info(o) : { cat: "Meals", srcs: [] };
          return (
            <div key={rid(r)} style={{ ...S.card, display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap", padding: 16 }}>
              <div style={{ width: 92, height: 92, borderRadius: 12, overflow: "hidden", flex: "none" }}>
                <FoodImg srcs={inf.srcs} cat={inf.cat} alt="" />
              </div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <b style={{ fontSize: 17 }}>{o ? o.item : `Offer #${r.offer_id}`}</b>
                <div style={{ color: C.muted, fontSize: 14, margin: "4px 0" }}>
                  Qty {r.quantity} · {money(r.total_price)}{o ? ` · 📍 ${o.pickup_location}` : ""}
                </div>
                <code style={{ color: C.green, fontSize: 13 }}>{rid(r)}</code>
                {r.reserved_at && <div style={{ color: "#5f7a6c", fontSize: 12, marginTop: 2 }}>{new Date(r.reserved_at).toLocaleString()}</div>}
              </div>
              <span style={badge(col[r.status] || C.muted)}>{r.status}</span>
              {r.status === "reserved" && <button style={S.btnDanger} onClick={() => setAsk(r)}>Cancel</button>}
            </div>
          );
        })}
        {!shown.length && <p style={{ color: C.muted }}>Nothing here yet.</p>}
      </div>
    </div>
  );
}