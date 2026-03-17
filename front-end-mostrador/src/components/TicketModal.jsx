import { fmt, PAYMENT_LABELS } from "../utils/constants";

export default function TicketModal({ order, onClose }) {
  const now = new Date().toLocaleString("es-AR");

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20,
    }}>
      <div style={{
        background: "white", borderRadius: 16, padding: 32,
        width: "100%", maxWidth: 360,
        fontFamily: "var(--font-mono)",
      }}>
        {/* Ticket */}
        <div id="ticket">
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 20, fontWeight: 800, fontFamily: "var(--font-display)" }}>🏴 Punto Café</div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>{now}</div>
            <div style={{ fontSize: 13, marginTop: 4 }}>Mesa {order.table_id} — Pedido #{order.id}</div>
          </div>

          <div style={{ borderTop: "1px dashed #ccc", borderBottom: "1px dashed #ccc", padding: "12px 0", margin: "12px 0" }}>
            {order.items.map((item) => (
              <div key={item.id} style={{
                display: "flex", justifyContent: "space-between",
                fontSize: 13, marginBottom: 4,
              }}>
                <span>×{item.quantity} Item #{item.menu_item_id}</span>
                <span>{fmt(item.subtotal)}</span>
              </div>
            ))}
          </div>

          {order.notes && (
            <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 8 }}>
              Nota: {order.notes}
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 16 }}>
            <span>TOTAL</span>
            <span>{fmt(order.total)}</span>
          </div>

          <div style={{ textAlign: "center", marginTop: 12, fontSize: 12, color: "var(--muted)" }}>
            {PAYMENT_LABELS[order.payment_method]} · {order.payment_status === "paid" ? "✓ Cobrado" : "Pendiente pago"}
          </div>

          <div style={{ textAlign: "center", marginTop: 16, fontSize: 12, color: "var(--muted)" }}>
            ¡Gracias por visitarnos!
          </div>
        </div>

        {/* Buttons */}
        <div className="no-print" style={{ display: "flex", gap: 8, marginTop: 20 }}>
          <button
            onClick={() => window.print()}
            style={{
              flex: 1, padding: "11px", borderRadius: 10, border: "none",
              background: "var(--black)", color: "white",
              fontWeight: 600, fontSize: 14, fontFamily: "var(--font-display)",
            }}
          >🖨 Imprimir</button>
          <button
            onClick={onClose}
            style={{
              padding: "11px 16px", borderRadius: 10,
              border: "1px solid var(--border)", background: "transparent",
              fontSize: 14, fontFamily: "var(--font-display)",
            }}
          >Cerrar</button>
        </div>
      </div>
    </div>
  );
}
