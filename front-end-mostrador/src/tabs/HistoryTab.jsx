import { useState, useEffect } from "react";
import { getOrders } from "../api";
import { fmt, timeAgo, PAYMENT_LABELS } from "../utils/constants";

const toLocalDate = (dateStr) =>
  new Date(dateStr + "Z").toLocaleDateString("en-CA"); // YYYY-MM-DD en zona local

const todayLocal = () => new Date().toLocaleDateString("en-CA");

export default function HistoryTab({ onPrint }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(todayLocal());

  useEffect(() => {
    getOrders("delivered").then(setOrders).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ padding: 32, textAlign: "center", color: "var(--muted)" }}>
      Cargando historial…
    </div>
  );

  const filtered = orders.filter(o => toLocalDate(o.created_at) === date);
  const total = filtered.reduce((s, o) => s + o.total, 0);
  const isToday = date === todayLocal();

  return (
    <div style={{ padding: 20, maxWidth: 700, margin: "0 auto" }}>

      {/* Selector de fecha */}
      <div style={{ marginBottom: 16, display: "flex", gap: 8, alignItems: "center" }}>
        <input
          type="date"
          value={date}
          max={todayLocal()}
          onChange={e => setDate(e.target.value)}
          style={{
            flex: 1, padding: "9px 12px",
            border: "1.5px solid var(--border)", borderRadius: 8,
            fontSize: 13, fontFamily: "var(--font-display)",
            background: "var(--card)", color: "var(--black)", outline: "none",
          }}
          onFocus={e => e.target.style.borderColor = "var(--gold)"}
          onBlur={e => e.target.style.borderColor = "var(--border)"}
        />
        {!isToday && (
          <button
            onClick={() => setDate(todayLocal())}
            style={{
              padding: "9px 14px", borderRadius: 8, whiteSpace: "nowrap",
              border: "1px solid var(--border)", background: "var(--card)",
              color: "var(--muted)", fontSize: 13, cursor: "pointer",
            }}
          >Hoy</button>
        )}
      </div>

      {/* Resumen */}
      <div style={{
        background: "var(--black)", color: "white",
        borderRadius: 12, padding: "16px 20px", marginBottom: 20,
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div>
          <div style={{ fontSize: 11, opacity: 0.6, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            {isToday ? "Pedidos entregados hoy" : "Pedidos entregados"}
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, fontFamily: "var(--font-mono)" }}>
            {filtered.length}
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

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", color: "var(--muted)", padding: 40 }}>
          No hay pedidos entregados {isToday ? "hoy" : "en esta fecha"}
        </div>
      ) : (
        filtered.map(order => (
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
        ))
      )}
    </div>
  );
}
