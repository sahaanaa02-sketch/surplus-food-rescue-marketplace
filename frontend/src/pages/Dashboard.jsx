import { useEffect, useState } from "react";
import { api, rid } from "../api";
import OfferCard from "../components/OfferCard";
import Toast, { ConfirmDialog } from "../components/Toast";
import { C, S, T, badge, money } from "../theme";

const pad = n => String(n).padStart(2, "0");
const toInput = d =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
const iso = v => (v.length === 16 ? v + ":00" : v);

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
  const [ask, setAsk] = useState(null);
  const set = k => e => setF({ ...f, [k]: e.target.value });

  const loadOffers = () => api.myOffers().then(d => setOffers(d || [])).catch(e => setMsg({ err: e.message }));
  const loadResv = () =>
    api.report("customer-reservations")
      .then(d => setResv(Array.isArray(d) ? d : d?.reservations || d?.data || Object.values(d || {}).find(Array.isArray) || []))
      .catch(() => setResv([]));
  useEffect(() => { loadOffers(); loadResv(); }, []);

  // ennoda offers ku vantha reservations mattum
  const mine = new Set(offers.map(o => o.offer_id));
  const myResv = resv.filter(r => mine.has(r.offer_id));

  const endIn = hours => setF({ ...f, pickup_end: toInput(new Date(Date.now() + hours * 3600e3)) });
  const tonight = () => {
    const d = new Date(); d.setHours(22, 0, 0, 0);
    if (d < new Date()) d.setDate(d.getDate() + 1);
    setF({ ...f, pickup_end: toInput(d) });
  };

  async function create() {
    const labels = { item: "Item name", original_price: "Original price", discounted_price: "Discounted price", quantity: "Quantity", pickup_location: "Pickup location", pickup_start: "Pickup start", pickup_end: "Pickup end" };
    for (const k of Object.keys(labels)) if (!String(f[k]).trim()) return setMsg({ err: `Please fill: ${labels[k]}` });
    const op = +f.original_price, dp = +f.discounted_price, q = +f.quantity;
    if (!(op > 0) || !(dp > 0)) return setMsg({ err: "Prices must be greater than 0" });
    if (dp >= op) return setMsg({ err: "Discounted price must be lower than original price" });
    if (!Number.isInteger(q) || q <= 0) return setMsg({ err: "Quantity must be a whole number above 0" });

    const st = new Date(f.pickup_start), en = new Date(f.pickup_end);
    if (en <= st) return setMsg({ err: "Pickup end must be after pickup start" });
    if (en <= new Date()) return setMsg({ err: "Pickup end must be in the future" });
    if (en - st > 12 * 3600e3) return setMsg({ err: "Pickup window can be at most 12 hours" });
    if (en - new Date() > 24 * 3600e3) return setMsg({ err: "Surplus offers are for tonight. Pickup must end within 24 hours" });

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
    const fmt = d => toInput(d).replace("T", " ") + ":00";
    const head = "item,description,original_price,discounted_price,quantity,pickup_location,pickup_start,pickup_end\n";
    const row = `Fresh Bakery Box,Assorted breads,1200,600,10,"Jaffna Bake House, Nallur",${fmt(new Date())},${fmt(new Date(Date.now() + 5 * 3600e3))}\n`;
    Object.assign(document.createElement("a"), { href: URL.createObjectURL(new Blob([head + row], { type: "text/csv" })), download: "offers_template.csv" }).click();
  }

  async function del() {
    const o = ask;
    setAsk(null);
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
    ["Meals left", offers.reduce((s, o) => s + o.quantity, 0), C.blue],
    ["Awaiting pickup", myResv.filter(r => r.status === "reserved").length, C.amber],
    ["Collected", myResv.filter(r => r.status === "collected").length, C.green],
  ];
  const chip = { ...S.btnGhost, padding: "6px 12px", fontSize: 13, borderRadius: 99 };

  return (
    <div style={S.page}>
      <Toast msg={msg} onClose={() => setMsg(null)} />
      <ConfirmDialog open={!!ask} title="Delete this offer?" text={ask ? `"${ask.item}" will be removed from the marketplace.` : ""}
        yes="Yes, delete" danger onYes={del} onNo={() => setAsk(null)} />

      <h1 style={{ margin: "0 0 24px", fontSize: 32 }}>Business <span style={{ color: C.green }}>Dashboard</span></h1>

      <div className="kpi-grid" style={{ marginBottom: 32 }}>
        {kpis.map(([l, n, c]) => (
          <div key={l} style={S.card}>
            <div style={{ color: C.muted, fontSize: 13 }}>{l}</div>
            <div style={{ fontSize: 34, fontWeight: 800, color: c }}>{n}</div>
          </div>
        ))}
      </div>

      <div className="two-col" style={{ gridTemplateColumns: "2fr 1fr", marginBottom: 36, alignItems: "start" }}>
        <div style={S.card}>
          <h3 style={{ margin: "0 0 18px" }}>Publish a surplus offer</h3>
          <div className="form-grid">
            <label style={S.label}>Item name<input style={S.input} placeholder="Fresh Bakery Box" value={f.item} onChange={set("item")} /></label>
            <label style={S.label}>Original price (Rs.)<input style={S.input} type="number" min="0" placeholder="1200" value={f.original_price} onChange={set("original_price")} /></label>
            <label style={S.label}>Discounted price (Rs.)<input style={S.input} type="number" min="0" placeholder="600" value={f.discounted_price} onChange={set("discounted_price")} /></label>
            <label style={S.label}>Quantity<input style={S.input} type="number" min="1" placeholder="10" value={f.quantity} onChange={set("quantity")} /></label>
            <label style={{ ...S.label, gridColumn: "span 2" }}>Pickup location<input style={S.input} placeholder="Jaffna Bake House, Nallur, Jaffna" value={f.pickup_location} onChange={set("pickup_location")} /></label>
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

      <h2 style={{ margin: "0 0 14px" }}>Customer reservations</h2>
      <div style={{ ...S.card, padding: 0, marginBottom: 36 }} className="table-wrap">
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>{["Reservation ID", "Customer", "Item", "Qty", "Total", "Status", ""].map(h => <th key={h} style={T.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {myResv.map(r => (
              <tr key={rid(r)}>
                <td style={T.td}><code style={{ color: C.green }}>{rid(r)}</code></td>
                <td style={T.td}>{r.customer_username ?? r.customer ?? "-"}</td>
                <td style={T.td}>{r.item ?? `Offer #${r.offer_id}`}</td>
                <td style={T.td}>{r.quantity}</td>
                <td style={T.td}>{money(r.total_price)}</td>
                <td style={T.td}><span style={badge(col[r.status] || C.muted)}>{r.status}</span></td>
                <td style={{ ...T.td, textAlign: "right" }}>
                  {r.status === "reserved" && <button style={S.btn} onClick={() => collect(r)}>Confirm collection</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!myResv.length && <p style={{ color: C.muted, padding: 22, margin: 0 }}>No reservations yet.</p>}
      </div>

      <h2 style={{ margin: "0 0 14px" }}>My offers</h2>
      <div className="cards-grid">
        {offers.map(o => (
          <OfferCard key={o.id ?? o.offer_id} o={o}>
            <button style={S.btnDanger} onClick={() => setAsk(o)}>Delete</button>
          </OfferCard>
        ))}
      </div>
      {!offers.length && <p style={{ color: C.muted }}>No offers yet. Publish one or import a CSV.</p>}
    </div>
  );
}