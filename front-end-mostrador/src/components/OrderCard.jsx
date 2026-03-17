import { useState } from "react";
import { fmt, timeAgo, timeAgoColor, STATUS_CONFIG, STATUS_NEXT_LABEL, PAYMENT_LABELS } from "../utils/constants";

export default function OrderCard({ order, onStatusChange, onPaymentChange, onPrint }) {
  const [expanded, setExpanded] = useState(true);
  const st     = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
  const isPaid = order.payment_status === "paid";

  return (
    <div className="fade-up" style={{
      background: "var(--card)",
      borderRadius: 12,
      border: "1px solid var(--border)",
      overflow: "hidden",
      boxShadow: order.status === "pending" ? "0 0 0 2px var(--gold)" : "none",
      transition: "box-shadow 0.2s",
    }}>
      {/* ── Header ── */}
      <div
        onClick={() => setExpanded(e => !e)}
        style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "12px 16px", cursor: "pointer",
          borderBottom: expanded ? "1px solid var(--border)" : "none",
        }}
      >
        {/* Mesa badge */}
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: "var(--black)", color: "white",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <span style={{ fontSize: 9, opacity: 0.6, lineHeight: 1 }}>MESA</span>
          <span style={{ fontSize: 16, fontWeight: 800, lineHeight: 1 }}>{order.table_id}</span>
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <span style={{ fontWeight: 700, fontSize: 15 }}>#{order.id}</span>
            <span style={{
              fontSize: 11, padding: "2px 8px", borderRadius: 6,
              background: st.bg, color: st.color, fontWeight: 600,
            }}>{st.label}</span>
            {order.status === "pending" && (
              <span style={{ fontSize: 11, animation: "pulse 1.5s infinite", color: "var(--gold)" }}>● nuevo</span>
            )}
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 2, fontSize: 12, color: "var(--muted)" }}>
            <span>{order.items.length} item{order.items.length !== 1 ? "s" : ""}</span>
            <span style={{ color: timeAgoColor(order.created_at) }}>⏱ {timeAgo(order.created_at)}</span>
            <span>{PAYMENT_LABELS[order.payment_method]}</span>
          </div>
        </div>

        {/* Total + pago */}
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontWeight: 800, fontSize: 16, fontFamily: "var(--font-mono)" }}>{fmt(order.total)}</div>
          <div style={{
            fontSize: 11, marginTop: 2, fontWeight: 600,
            color: isPaid ? "var(--green)" : "var(--orange)",
          }}>{isPaid ? "✓ Cobrado" : "Sin cobrar"}</div>
        </div>

        <span style={{ color: "var(--muted)", fontSize: 12, marginLeft: 4 }}>{expanded ? "▲" : "▼"}</span>
      </div>

      {/* ── Body ── */}
      {expanded && (
        <div style={{ padding: "12px 16px" }}>
          {/* Items list */}
          <div style={{ marginBottom: 12 }}>
            {order.items.map((item) => (
              <div key={item.id} style={{
                display: "flex", justifyContent: "space-between",
                padding: "5px 0", borderBottom: "1px solid var(--border)", fontSize: 13,
              }}>
                <span style={{ color: "var(--dark)" }}>
                  <span style={{ fontWeight: 600, marginRight: 6 }}>×{item.quantity}</span>
                  Item #{item.menu_item_id}
                </span>
                <span style={{ fontFamily: "var(--font-mono)", color: "var(--muted)" }}>{fmt(item.subtotal)}</span>
              </div>
            ))}

            {order.notes && (
              <div style={{
                marginTop: 8, padding: "7px 10px",
                background: "var(--bg2)", borderRadius: 8,
                fontSize: 12, color: "var(--dark)",
                borderLeft: "3px solid var(--gold)",
              }}>
                📝 {order.notes}
              </div>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {/* Avanzar estado */}
            {st.next && (
              <button
                onClick={() => onStatusChange(order.id, st.next)}
                style={{
                  flex: 1, minWidth: 120, padding: "9px 14px",
                  borderRadius: 8, border: "none",
                  background: "var(--black)", color: "white",
                  fontWeight: 600, fontSize: 13,
                }}
              >
                {STATUS_NEXT_LABEL[order.status]} →
              </button>
            )}

            {/* Cancelar */}
            {order.status !== "delivered" && order.status !== "cancelled" && (
              <button
                onClick={() => onStatusChange(order.id, "cancelled")}
                style={{
                  padding: "9px 12px", borderRadius: 8,
                  border: "1px solid var(--border)", background: "transparent",
                  color: "var(--red)", fontSize: 13,
                }}
              >✕ Cancelar</button>
            )}

            {/* Cobrar */}
            {!isPaid && (
              <button
                onClick={() => onPaymentChange(order.id, "paid")}
                style={{
                  padding: "9px 14px", borderRadius: 8,
                  border: "1px solid var(--green)", background: "var(--green-bg)",
                  color: "var(--green)", fontWeight: 600, fontSize: 13,
                }}
              >💵 Cobrar</button>
            )}

            {/* Ticket */}
            <button
              onClick={() => onPrint(order)}
              style={{
                padding: "9px 12px", borderRadius: 8,
                border: "1px solid var(--border)", background: "transparent",
                color: "var(--muted)", fontSize: 13,
              }}
            >🖨 Ticket</button>
          </div>
        </div>
      )}
    </div>
  );
}
