import OrderCard from "../components/OrderCard";

export default function OrdersTab({ orders, loading, onStatusChange, onPaymentChange, onPrint }) {
  if (loading) return (
    <div style={{ textAlign: "center", padding: 40, color: "var(--muted)" }}>
      Cargando pedidos…
    </div>
  );

  if (orders.length === 0) return (
    <div style={{ textAlign: "center", padding: 60 }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>☕</div>
      <div style={{ color: "var(--muted)", fontSize: 15 }}>No hay pedidos activos</div>
    </div>
  );

  return (
    <div style={{ padding: 16, maxWidth: 700, margin: "0 auto" }}>
      {orders.map(order => (
        <div key={order.id} style={{ marginBottom: 12 }}>
          <OrderCard
            order={order}
            onStatusChange={onStatusChange}
            onPaymentChange={onPaymentChange}
            onPrint={onPrint}
          />
        </div>
      ))}
    </div>
  );
}
