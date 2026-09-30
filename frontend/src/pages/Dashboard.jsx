import { useEffect, useState } from "react";
import { api, rid } from "../api";
import OfferCard from "../components/OfferCard";
import Toast from "../components/Toast";
import { C, S, T, badge } from "../theme";

const pad = n => String(n).padStart(2, "0");
const toInput = d =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
const iso = v => (v.length === 16 ? v + ":00" : v);      // datetime-local -> seconds serndhu

const blank = () => {
  const now = new Date();
  return {
    item: "", description: "", original_price: "", discounted_price: "", quantity: "", pickup_location: "",
    pickup_start: toInput(now), pickup_end: toInput(new Date(now.getTime() + 3 * 3600e3)),
  };
};
const col = { reserved: C.amber, collected: C.green, cancelled: C.red };

export default function Dashboard() {
  const [offers, setOffers] = useState([]);
  const [resv, setResv] = useState([]);
  const [f, setF] = useState(blank());
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);
  const set = k => e => setF({ ...f, [k]: e.target.value });

  const loadOffers = () => api.myOffers().then(d => setOffers(d || [])).catch(e => setMsg({ err: e.message }));
  const loadResv = () =>
    api.report("customer-reservations")
      .then(d => setResv(Array.isArray(d) ? d : d?.reservations || d?.data || Object.values(d || {}).find(Array.isArray) || []))
      .catch(() => setResv([]));
  useEffect(() => { loadOffers(); loadResv(); }, []);

  const endIn = hours => setF({ ...f, pickup_end: toInput(new Date(Date.now() + hours * 3600e3)) });
  const tonight = () => { const d = new Date(); d.setHours(22, 0, 0, 0); if (d < new Date()) d.setDate(d.getDate() + 1); setF({ ...f, pickup_end: toInput(d) }); };

  async function create() {
    const labels = { item: "Item name", original_price: "Original price", discounted_price: "Discounted price", quantity: "Quantity", pickup_location: "Pickup location", pickup_start: "Pickup start", pickup_end: "Pickup end" };
    for (const k of Object.keys(labels)) if (!String(f[k]).trim()) return setMsg({ err: `Please fill: ${labels[k]}` });
    const op = +f.original_price, dp = +f.discounted_price, q = +f.quantity;
    if (!(op > 0) || !(dp > 0)) return setMsg({ err: "Prices must be greater than 0" });
    if (dp >= op) return setMsg({ err: "Discounted price must be lower than original price" });
    if (!Number.isInteger(q) || q <= 0) return setMsg({ err: "Quantity must be a whole number above 0" });
    if (new Date(f.pickup_end) <= new Date(f.pickup_start)) return setMsg({ err: "Pickup end must be after pickup start" });

    setBusy(true);
    try {
      await api.createOffer({
        item: f.item.trim(), description: f.description.trim(), original_price: op, discounted_price: dp, quantity: q,
        pickup_location: f.pickup_location.trim(), pickup_start: iso(f.pickup_start), pickup_end: iso(f.pickup_end),
      });
      setF(blank());
      setMsg({ ok: "Offer published" });
      loadOffers();
    } catch (e) {
      setMsg({ err: e.message });
    } finally {
      setBusy(false);
    }
  }

  async function csv(e) {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const r = await api.importCsv(file);
      setMsg({ ok: r?.message ? `${r.message} (${r.imported_count ?? ""} rows)` : "CSV imported" });
      loadOffers();
    } catch (er) {
      setMsg({ err: er.message });
    }
    e.target.value = "";
  }

  function template() {
    const head = "item,description,original_price,discounted_price,quantity,pickup_location,pickup_start,pickup_end\n";
    const row = `Fresh Bakery Box,Assorted breads,500,250,10,City Bakery,${toInput(new Date()).replace("T", " ")}:00,${toInput(new Date(Date.now() + 5 * 3600e3)).replace("T", " ")}:00\n`;
    const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(new Blob([head + row], { type: "text/csv" })), download: "offers_template.csv" });
    a.click();
  }

  async function del(o) {
    if (!window.confirm(`Delete "${o.item}"?`)) return;
    try { await api.deleteOffer(o.id ?? o.offer_id); setMsg({ ok: "Offer deleted" }); loadOffers(); }
    catch (e) { setMsg({ err: e.message }); }
  }

  async function collect(r) {
    try { await api.collect(rid(r)); setMsg({ ok: "Marked as collected" }); loadResv(); loadOffers(); }
    catch (e) { setMsg({ err: e.message }); }
  }

  const live = offers.filter(o => new Date(o.pickup_end) > new Date() && o.quantity > 0);
  const kpis = [
    ["Active offers", live.length, C.green],
    ["Units left", offers.reduce((s, o) => s + o.quantity, 0), C.blue],
    ["Awaiting pickup", resv.filter(r => r.status === "reserved").length, C.amber],
    ["Collected", resv.filter(r => r.status === "collected").length, C.green],
  ];
  const chip = { ...S.btnGhost, padding: "6px 12px", fontSize: 13, borderRadius: 99 };

  return (
    <div style={S.page}>
      <Toast msg={msg} onClose={() => setMsg(null)} />
      <h1 style={{ margin: "0 0 24px", fontSize: 32 }}>Business <span style={{ color: C.green }}>Dashboard</span></h1>

      {/* KPI */}
      <div className="kpi-grid" style={{ marginBottom: 32 }}>
        {kpis.map(([l, n, c]) => (
          <div key={l} style={S.card}>
            <div style={{ color: C.muted, fontSize: 13 }}>{l}</div>
            <div style={{ fontSize: 34, fontWeight: 800, color: c }}>{n}</div>
          </div>
        ))}
      </div>

      {/* PUBLISH + CSV */}
      <div className="two-col" style={{ gridTemplateColumns: "2fr 1fr", marginBottom: 36, alignItems: "start" }}>
        <div style={S.card}>
          <h3 style={{ margin: "0 0 18px" }}>Publish a surplus offer</h3>
          <div className="form-grid">
            <label style={S.label}>Item name<input style={S.input} placeholder="Fresh Bakery Box" value={f.item} onChange={set("item")} /></label>
            <label style={S.label}>Original price (₹)<input style={S.input} type="number" min="0" placeholder="500" value={f.original_price} onChange={set("original_price")} /></label>
            <label style={S.label}>Discounted price (₹)<input style={S.input} type="number" min="0" placeholder="250" value={f.discounted_price} onChange={set("discounted_price")} /></label>
            <label style={S.label}>Quantity<input style={S.input} type="number" min="1" placeholder="10" value={f.quantity} onChange={set("quantity")} /></label>
            <label style={{ ...S.label, gridColumn: "span 2" }}>Pickup location<input style={S.input} placeholder="City Bakery, Main St" value={f.pickup_location} onChange={set("pickup_location")} /></label>
            <label style={{ ...S.label, gridColumn: "1 / -1" }}>Description<input style={S.input} placeholder="Assorted breads and buns baked today" value={f.description} onChange={set("description")} /></label>
            <label style={S.label}>Pickup start<input type="datetime-local" style={S.input} value={f.pickup_start} onChange={set("pickup_start")} /></label>
            <label style={S.label}>Pickup end<input type="datetime-local" style={S.input} value={f.pickup_end} onChange={set("pickup_end")} /></label>
            <div style={{ ...S.label, alignContent: "end" }}>
              Quick end time
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <button type="button" style={chip} onClick={() => endIn(2)}>+2h</button>
                <button type="button" style={chip} onClick={() => endIn(4)}>+4h</button>
                <button type="button" style={chip} onClick={tonight}>10 PM</button>
              </div>
            </div>
          </div>
          <button style={{ ...S.btn, marginTop: 22 }} disabled={busy} onClick={create}>{busy ? "Publishing..." : "+ Publish offer"}</button>
        </div>

        <div style={S.card}>
          <h3 style={{ margin: "0 0 8px" }}>Bulk import (CSV)</h3>
          <p style={{ color: C.muted, fontSize: 14, margin: "0 0 16px" }}>
            Upload many offers at once. Each row is validated; bad rows are rejected.
          </p>
          <div style={{ display: "grid", gap: 10 }}>
            <label style={{ ...S.btn, textAlign: "center", display: "block" }}>
              📄 Choose CSV file
              <input type="file" accept=".csv" hidden onChange={csv} />
            </label>
            <button style={S.btnGhost} onClick={template}>⬇ Download template</button>
          </div>
        </div>
      </div>

      {/* RESERVATIONS */}
      <h2 style={{ margin: "0 0 14px" }}>Customer reservations</h2>
      <div style={{ ...S.card, padding: 0, marginBottom: 36 }} className="table-wrap">
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>{["Reservation ID", "Customer", "Item", "Qty", "Status", ""].map(h => <th key={h} style={T.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {resv.map(r => (
              <tr key={rid(r)}>
                <td style={T.td}><code style={{ color: C.green }}>{rid(r)}</code></td>
                <td style={T.td}>{r.customer_username ?? r.customer ?? r.customer_name ?? "-"}</td>
                <td style={T.td}>{r.item ?? r.offer_item ?? `Offer #${r.offer_id}`}</td>
                <td style={T.td}>{r.quantity}</td>
                <td style={T.td}><span style={badge(col[r.status] || C.muted)}>{r.status}</span></td>
                <td style={{ ...T.td, textAlign: "right" }}>
                  {r.status === "reserved" && <button style={S.btn} onClick={() => collect(r)}>Confirm collection</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!resv.length && <p style={{ color: C.muted, padding: 22, margin: 0 }}>No reservations yet.</p>}
      </div>

      {/* MY OFFERS */}
      <h2 style={{ margin: "0 0 14px" }}>My offers</h2>
      <div className="cards-grid">
        {offers.map(o => (
          <OfferCard key={o.id ?? o.offer_id} o={o}>
            <button style={S.btnDanger} onClick={() => del(o)}>Delete</button>
          </OfferCard>
        ))}
      </div>
      {!offers.length && <p style={{ color: C.muted }}>No offers yet. Publish one or import a CSV.</p>}
    </div>
  );
}