import { useEffect, useState } from "react";
import { api, download } from "../api";
import Toast from "../components/Toast";
import { C, S, T } from "../theme";

const REPORTS = [
  ["summary", "Surplus Sales / Rescue Summary"],
  ["offer-performance", "Offer Performance"],
  ["customer-reservations", "Customer Reservation / Collection"],
];

const pretty = k => k.replace(/_/g, " ").replace(/^\w/, c => c.toUpperCase());
const isObj = v => v && typeof v === "object" && !Array.isArray(v);

function ReportView({ data }) {
  if (!data) return <p style={{ color: C.muted }}>Loading...</p>;

  const rows = Array.isArray(data) ? data : Object.values(data).find(Array.isArray);
  // scalar values + ondru level nested object values ah tiles aa kaattrom
  const tiles = [];
  if (isObj(data)) {
    Object.entries(data).forEach(([k, v]) => {
      if (k === "report" || Array.isArray(v)) return;
      if (isObj(v)) Object.entries(v).forEach(([sk, sv]) => !isObj(sv) && !Array.isArray(sv) && tiles.push([`${k} ${sk}`, sv]));
      else tiles.push([k, v]);
    });
  }
  const cols = rows?.[0] ? Object.keys(rows[0]).filter(k => !isObj(rows[0][k]) && !Array.isArray(rows[0][k])) : [];

  return (
    <div>
      {tiles.length > 0 && (
        <div className="kpi-grid" style={{ marginBottom: rows?.length ? 22 : 0 }}>
          {tiles.map(([k, v]) => (
            <div key={k} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
              <div style={{ color: C.muted, fontSize: 12 }}>{pretty(k)}</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: C.green }}>{String(v)}</div>
            </div>
          ))}
        </div>
      )}
      {rows?.length > 0 && (
        <div className="table-wrap" style={{ border: `1px solid ${C.border}`, borderRadius: 12 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr>{cols.map(c => <th key={c} style={T.th}>{pretty(c)}</th>)}</tr></thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>{cols.map(c => <td key={c} style={T.td}>{String(r[c] ?? "-")}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {!tiles.length && !rows?.length && <p style={{ color: C.muted }}>No data yet.</p>}
    </div>
  );
}

export default function Reports() {
  const [tab, setTab] = useState(REPORTS[0][0]);
  const [data, setData] = useState({});
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    REPORTS.forEach(([k]) => api.report(k).then(d => setData(s => ({ ...s, [k]: d }))).catch(e => setData(s => ({ ...s, [k]: {} }))));
  }, []);

  async function dl(ext) {
    try { await download(`/reports/${tab}/${ext}`, `${tab}.${ext}`); }
    catch (e) { setMsg({ err: e.message }); }
  }

  const title = REPORTS.find(r => r[0] === tab)[1];

  return (
    <div style={S.page}>
      <Toast msg={msg} onClose={() => setMsg(null)} />
      <h1 style={{ margin: "0 0 22px", fontSize: 32 }}>Reports</h1>

      <div className="chips" style={{ marginBottom: 22 }}>
        {REPORTS.map(([k, t]) => (
          <button key={k} onClick={() => setTab(k)} style={{ ...(tab === k ? S.btn : S.btnGhost), borderRadius: 99, padding: "8px 18px" }}>{t}</button>
        ))}
      </div>

      <div style={S.card}>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginBottom: 22 }}>
          <h3 style={{ margin: 0, marginRight: "auto" }}>{title}</h3>
          <button style={S.btnGhost} onClick={() => dl("csv")}>⬇ Download CSV</button>
          <button style={S.btn} onClick={() => dl("pdf")}>⬇ Download PDF</button>
        </div>
        <ReportView data={data[tab]} />
      </div>
    </div>
  );
}