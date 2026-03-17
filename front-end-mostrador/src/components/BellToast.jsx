export default function BellToast({ table, onClose }) {
  return (
    <div style={{
      position: "fixed", top: 20, right: 20, zIndex: 999,
      background: "var(--black)", color: "white",
      borderRadius: 14, padding: "14px 20px",
      display: "flex", alignItems: "center", gap: 12,
      boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
      animation: "slideIn 0.4s cubic-bezier(0.16,1,0.3,1) both",
      minWidth: 220,
    }}>
      <span style={{ fontSize: 26, animation: "bellShake 0.6s ease" }}>🔔</span>
      <div>
        <div style={{ fontWeight: 700, fontSize: 15 }}>Mesa {table} llama</div>
        <div style={{ fontSize: 12, opacity: 0.6 }}>El cliente necesita atención</div>
      </div>
      <button
        onClick={onClose}
        style={{
          marginLeft: "auto", background: "rgba(255,255,255,0.15)",
          border: "none", color: "white", borderRadius: 8,
          width: 28, height: 28, fontSize: 16,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >✕</button>
    </div>
  );
}
