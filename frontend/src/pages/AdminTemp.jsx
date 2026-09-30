import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import Toast from "../components/Toast";
import { C, S, T, badge } from "../theme";

const roleColor = { customer: C.blue, food_owner: C.amber, admin: C.green };
const roleName = { customer: "Customer", food_owner: "Business", admin: "Admin" };

export default function Admin() {
  const [sum, setSum] = useState(null);
  const [users, setUsers] = useState([]);
  const [tab, setTab] = useState("overview");
  const [q, setQ] = useState("");
  const [role, setRole] = useState("all");
  const [msg, setMsg] = useState(null);

  const load = () => {
    api.adminSummary().then(setSum).catch(e => setMsg({ err: e.message }));
    api.adminUsers().then(d => setUsers(d?.users || [])).catch(e => setMsg({ err: e.message }));
  };
  useEffect(() => { load(); }, []);

  async function toggle(u) {
    try {
      await api.toggleUser(u.id);
      setMsg({ ok: `${u.username} is now ${u.is_active ? "deactivated" : "activated"}` });
      load();
    } catch (e) {
      setMsg({ err: e.message });      // admin thannaiye deactivate panna backend reject pannum
    }
  }

  const U = sum?.users || {};
  const M = sum?.marketplace || {};
  const total = M.total_reservations || 0;
  const pct = n => (total ? Math.round((n / total) * 100) : 0);

  const userCards = [
    ["Total users", U.total, C.text], ["Customers", U.customers, C.blue], ["Food businesses", U.food_owners, C.amber],
    ["Admins", U.admins, C.green], ["Active", U.active, C.green], ["Inactive", U.inactive, C.red],
  ];
  const market = [["Total offers", M.total_offers], ["Total reservations", M.total_reservations]];
  const bars = [["Reserved", M.reserved, C.amber], ["Collected", M.collected, C.green], ["Cancelled", M.cancelled, C.red]];

  const shown = users
    .filter(u => role === "all" || u.role === role)
    .filter(u => (u.username + u.email + u.full_name).toLowerCase().includes(q.toLowerCase()));

  return (
    <div style={S.page}>
      <Toast msg={msg} onClose={() => setMsg(null)} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 22 }}>
        <h1 style={{ margin: 0, fontSize: 32 }}>Admin <span style={{ color: C.green }}>Dashboard</span></h1>
        <Link to="/reports"><button style={S.btnGhost}>📊 View reports</button></Link>
      </div>

      <div className="chips" style={{ marginBottom: 24 }}>
        {[["overview", "Overview"], ["users", `Users (${users.length})`]].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} style={{ ...(tab === k ? S.btn : S.btnGhost), borderRadius: 99, padding: "8px 18px" }}>{l}</button>
        ))}
      </div>

      {tab === "overview" && (
        <>
          <h3 style={{ margin: "0 0 12px", color: C.muted }}>Users</h3>
          <div className="kpi-grid" style={{ marginBottom: 32 }}>
            {userCards.map(([l, n, c]) => (
              <div key={l} style={S.card}>
                <div style={{ color: C.muted, fontSize: 13 }}>{l}</div>
                <div style={{ fontSize: 34, fontWeight: 800, color: c }}>{n ?? "-"}</div>
              </div>
            ))}
          </div>

          <h3 style={{ margin: "0 0 12px", color: C.muted }}>Marketplace</h3>
          <div className="two-col" style={{ alignItems: "start" }}>
            <div className="kpi-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
              {market.map(([l, n]) => (
                <div key={l} style={S.card}>
                  <div style={{ color: C.muted, fontSize: 13 }}>{l}</div>
                  <div style={{ fontSize: 34, fontWeight: 800 }}>{n ?? "-"}</div>
                </div>
              ))}
              <div style={{ ...S.card, gridColumn: "1 / -1" }}>
                <div style={{ color: C.muted, fontSize: 13 }}>Rescue rate (collected / reservations)</div>
                <div style={{ fontSize: 34, fontWeight: 800, color: C.green }}>{pct(M.collected || 0)}%</div>
              </div>
            </div>

            <div style={S.card}>
              <h3 style={{ margin: "0 0 18px" }}>Reservation status</h3>
              {bars.map(([l, n, c]) => (
                <div key={l} style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 6 }}>
                    <span>{l}</span><b>{n ?? 0} · {pct(n || 0)}%</b>
                  </div>
                  <div style={{ height: 10, background: "#0e1613", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ width: `${pct(n || 0)}%`, height: "100%", background: c, transition: "width .6s" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {tab === "users" && (
        <>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
            <input style={{ ...S.input, flex: 1, minWidth: 240 }} placeholder="🔍 Search name, username or email..." value={q} onChange={e => setQ(e.target.value)} />
            <select style={{ ...S.input, width: 190 }} value={role} onChange={e => setRole(e.target.value)}>
              <option value="all">All roles</option>
              <option value="customer">Customers</option>
              <option value="food_owner">Businesses</option>
              <option value="admin">Admins</option>
            </select>
          </div>
          <div style={{ ...S.card, padding: 0 }} className="table-wrap">
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr>{["ID", "User", "Email", "Role", "Status", ""].map(h => <th key={h} style={T.th}>{h}</th>)}</tr></thead>
              <tbody>
                {shown.map(u => (
                  <tr key={u.id}>
                    <td style={T.td}>{u.id}</td>
                    <td style={T.td}><b>{u.username}</b><div style={{ color: C.muted, fontSize: 12 }}>{u.full_name}</div></td>
                    <td style={T.td}>{u.email}</td>
                    <td style={T.td}><span style={badge(roleColor[u.role] || C.muted)}>{roleName[u.role] || u.role}</span></td>
                    <td style={T.td}><span style={badge(u.is_active ? C.green : C.red)}>{u.is_active ? "Active" : "Inactive"}</span></td>
                    <td style={{ ...T.td, textAlign: "right" }}>
                      <button style={u.is_active ? S.btnDanger : S.btn} onClick={() => toggle(u)}>
                        {u.is_active ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!shown.length && <p style={{ color: C.muted, padding: 22, margin: 0 }}>No users found.</p>}
          </div>
        </>
      )}
    </div>
  );
}