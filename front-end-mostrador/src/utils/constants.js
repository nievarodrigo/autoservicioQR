export const WS_URL = "ws://localhost:8000/ws/mostrador"; // cambiá igual que API_BASE

export const STATUS_CONFIG = {
  pending:   { label: "Pendiente",  color: "#c4913a", bg: "#fef8ed", next: "confirmed" },
  confirmed: { label: "Confirmado", color: "#1a4a7a", bg: "#eef3fa", next: "preparing" },
  preparing: { label: "Preparando", color: "#7a4a1a", bg: "#fef3e8", next: "ready"     },
  ready:     { label: "Listo ✓",    color: "#2d6a4f", bg: "#eaf4ee", next: "delivered" },
  delivered: { label: "Entregado",  color: "#6a6a6a", bg: "#f0f0f0", next: null        },
  cancelled: { label: "Cancelado",  color: "#c0392b", bg: "#fdf0ee", next: null        },
};

export const STATUS_NEXT_LABEL = {
  pending:   "Confirmar",
  confirmed: "Empezar",
  preparing: "Marcar listo",
  ready:     "Entregar",
};

export const PAYMENT_LABELS = {
  cash:    "💵 Efectivo",
  digital: "📱 Digital",
  card:    "💳 Tarjeta",
};

export function fmt(n) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency", currency: "ARS", maximumFractionDigits: 0,
  }).format(n);
}

export function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr + "Z").getTime()) / 1000);
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}min`;
  return `${Math.floor(diff / 3600)}h`;
}

export function timeAgoColor(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr + "Z").getTime()) / 1000);
  if (diff < 300) return "var(--green)";
  if (diff < 600) return "var(--orange)";
  return "var(--red)";
}
