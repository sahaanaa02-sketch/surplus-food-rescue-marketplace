export const C = {
  bg: "#0b1210", card: "#131d19", card2: "#0f1a15", border: "#213229",
  green: "#22c55e", greenDark: "#15803d", text: "#e8f5ec", muted: "#8aa596",
  amber: "#f59e0b", red: "#ef4444", blue: "#38bdf8",
};

// Sri Lankan Rupees
export const money = n =>
  "Rs. " + Number(n || 0).toLocaleString("en-LK", { maximumFractionDigits: 2 });

export const S = {
  page: { maxWidth: 1200, margin: "0 auto", padding: "32px 24px" },
  card: { background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 22 },
  input: { width: "100%", padding: "12px 14px", borderRadius: 10, border: `1px solid ${C.border}`, background: "#0e1613", color: C.text, outline: "none" },
  label: { display: "grid", gap: 6, color: C.muted, fontSize: 13, fontWeight: 600 },
  btn: { background: `linear-gradient(135deg, ${C.green}, ${C.greenDark})`, color: "#fff", border: 0, padding: "11px 20px", borderRadius: 10, fontWeight: 700, cursor: "pointer" },
  btnGhost: { background: "transparent", color: C.text, border: `1px solid ${C.border}`, padding: "10px 18px", borderRadius: 10, cursor: "pointer" },
  btnDanger: { background: "transparent", color: C.red, border: `1px solid ${C.red}`, padding: "9px 16px", borderRadius: 10, cursor: "pointer" },
};

export const T = {
  th: { textAlign: "left", padding: "12px 14px", color: C.muted, fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5, borderBottom: `1px solid ${C.border}`, whiteSpace: "nowrap" },
  td: { padding: "14px", borderBottom: `1px solid ${C.border}`, fontSize: 14, verticalAlign: "middle" },
};

export const badge = color => ({
  background: color + "22", color, padding: "4px 10px", borderRadius: 99, fontSize: 12, fontWeight: 700, whiteSpace: "nowrap",
});