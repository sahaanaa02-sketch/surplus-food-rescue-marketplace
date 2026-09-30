import { useEffect } from "react";
import { C } from "../theme";

// msg = { ok: "..." } illa { err: "..." }
export default function Toast({ msg, onClose }) {
  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(onClose, 4500);
    return () => clearTimeout(t);
  }, [msg]);

  if (!msg) return null;
  const color = msg.err ? C.red : C.green;

  return (
    <div style={{
      position: "fixed", top: 80, right: 20, zIndex: 100, maxWidth: 380,
      background: C.card, border: `1px solid ${color}66`, borderLeft: `5px solid ${color}`,
      borderRadius: 12, padding: "14px 16px", boxShadow: "0 12px 40px #000b",
      display: "flex", gap: 12, alignItems: "flex-start", color: C.text,
    }}>
      <span style={{ fontSize: 20 }}>{msg.err ? "⚠️" : "✅"}</span>
      <span style={{ flex: 1, fontSize: 14 }}>{msg.err || msg.ok}</span>
      <button onClick={onClose} style={{ background: "none", border: 0, color: C.muted, cursor: "pointer", fontSize: 18 }}>×</button>
    </div>
  );
}