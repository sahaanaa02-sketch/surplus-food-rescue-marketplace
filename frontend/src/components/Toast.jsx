import { useEffect } from "react";
import { C, S } from "../theme";

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

// window.confirm ku bathila app kulla varra popup
export function ConfirmDialog({ open, title, text, yes = "Confirm", danger = false, onYes, onNo }) {
  if (!open) return null;
  return (
    <div onClick={onNo} style={{ position: "fixed", inset: 0, background: "#000b", display: "grid", placeItems: "center", zIndex: 120, padding: 16 }}>
      <div onClick={e => e.stopPropagation()} style={{ ...S.card, width: 380, maxWidth: "100%", display: "grid", gap: 12 }}>
        <h3 style={{ margin: 0 }}>{title}</h3>
        <p style={{ margin: 0, color: C.muted }}>{text}</p>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 6 }}>
          <button style={S.btnGhost} onClick={onNo}>No, keep it</button>
          <button style={danger ? { ...S.btn, background: C.red } : S.btn} onClick={onYes}>{yes}</button>
        </div>
      </div>
    </div>
  );
}