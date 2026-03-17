import { useState, useEffect } from "react";
import { getOrders } from "../api";
import { fmt, timeAgo, PAYMENT_LABELS } from "../utils/constants";

export default function HistoryTab({ onPrint }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrders("delivered").then(setOrders).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ padding: 32, textAlign: "center", color: "var(--muted)" }}>
      Cargando historial…
    </div>
  );

  const total = orders.reduce((s, o) => s + o.total, 0);

  return (
    <div style={{ padding: 20, maxWidth: 700, margin: "0 auto" }}>
      {/* Resumen del día */}
      <div style={{
        background: "var(--black)", color: "white",
        borderRadius: 12, padding: "16px 20px", marginBottom: 20,
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div>
          <div style={{ fontSize: 11, opacity: 0.6, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Pedidos entregados hoy
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, fontFamily: "var(--font-mono)" }}>
            {orders.length}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 11, opacity: 0.6, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Total recaudado
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, fontFamily: "var(--font-mono)" }}>
            {fmt(total)}
          </div>
        </div>
      </div>

      {orders.length === 0 && (
        <div style={{ textAlign: "center", color: "var(--muted)", padding: 40 }}>
          No hay pedidos entregados aún
        </div>
      )}

      {orders.map(order => (
        <div key={order.id} style={{
          background: "var(--card)", borderRadius: 10,
          border: "1px solid var(--border)", padding: "12px 16px",
          marginBottom: 8,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <div style={{ fontWeight: 700 }}>Mesa {order.table_id} — #{order.id}</div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
              {order.items.length} items · {PAYMENT_LABELS[order.payment_method]} · hace {timeAgo(order.created_at)}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontWeight: 700, fontFamily: "var(--font-mono)" }}>{fmt(order.total)}</span>
            <button
              onClick={() => onPrint(order)}
              style={{
                padding: "5px 10px", borderRadius: 6,
                border: "1px solid var(--border)", background: "transparent",
                color: "var(--muted)", fontSize: 13,
              }}
            >🖨</button>
          </div>
        </div>
      ))}
    </div>
  );
}
