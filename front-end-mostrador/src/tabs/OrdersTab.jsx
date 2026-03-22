import { useState } from "react";
import OrderCard from "../components/OrderCard";

export default function OrdersTab({ orders, loading, onStatusChange, onPaymentChange, onPrint }) {
  const [query, setQuery] = useState("");

  if (loading) return (
    <div style={{ textAlign: "center", padding: 40, color: "var(--muted)" }}>
      Cargando pedidos…
    </div>
  );

  const filtered = query.trim()
    ? orders.filter(o =>
        String(o.table_id).includes(query.trim()) ||
        String(o.id).includes(query.trim())
      )
    : orders;

  return (
    <div style={{ padding: 16, maxWidth: 700, margin: "0 auto" }}>
      {/* Buscador */}
      <div style={{ marginBottom: 14, position: "relative" }}>
        <span style={{
          position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
          fontSize: 14, color: "var(--muted)", pointerEvents: "none",
        }}>🔍</span>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Buscar por mesa o # pedido…"
          style={{
            width: "100%", padding: "9px 12px 9px 34px",
            border: "1.5px solid var(--border)", borderRadius: 8,
            fontSize: 13, fontFamily: "var(--font-display)",
            background: "var(--card)", color: "var(--black)",
            outline: "none",
          }}
          onFocus={e => e.target.style.borderColor = "var(--gold)"}
          onBlur={e => e.target.style.borderColor = "var(--border)"}
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            style={{
              position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
              background: "none", border: "none", color: "var(--muted)", fontSize: 16, lineHeight: 1,
            }}
          >×</button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>{orders.length === 0 ? "☕" : "🔎"}</div>
          <div style={{ color: "var(--muted)", fontSize: 15 }}>
            {orders.length === 0 ? "No hay pedidos activos" : "Sin resultados para tu búsqueda"}
          </div>
        </div>
      ) : (
        filtered.map(order => (
          <div key={order.id} style={{ marginBottom: 12 }}>
            <OrderCard
              order={order}
              onStatusChange={onStatusChange}
              onPaymentChange={onPaymentChange}
              onPrint={onPrint}
            />
          </div>
        ))
      )}
    </div>
  );
}
