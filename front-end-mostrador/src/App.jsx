import { useState, useEffect, useCallback, useRef } from "react";
import GlobalStyles   from "./components/GlobalStyles";
import BellToast      from "./components/BellToast";
import TicketModal    from "./components/TicketModal";
import LoginScreen    from "./components/LoginScreen";
import OrdersTab      from "./tabs/OrdersTab";
import StockTab       from "./tabs/StockTab";
import HistoryTab     from "./tabs/HistoryTab";
import { useWebSocket } from "./hooks/useWebSocket";
import { getOrders, patchStatus, patchPayment } from "./api";

const TABS = [
  { id: "orders",  label: "Pedidos"  },
  { id: "stock",   label: "Stock"    },
  { id: "history", label: "Historial"},
];

const ACTIVE_STATUSES = ["pending", "confirmed", "preparing", "ready"];

export default function App() {
  const [authed, setAuthed]   = useState(() => !!localStorage.getItem("staff_token"));
  const [tab, setTab]         = useState("orders");
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [bell, setBell]       = useState(null);
  const [ticket, setTicket]   = useState(null);
  const timerRef = useRef(null);

  // Escuchar logout forzado (token expirado)
  useEffect(() => {
    const handler = () => setAuthed(false);
    window.addEventListener("auth:logout", handler);
    return () => window.removeEventListener("auth:logout", handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("staff_token");
    setAuthed(false);
  };

  if (!authed) {
    return (
      <>
        <GlobalStyles />
        <LoginScreen onLogin={() => setAuthed(true)} />
      </>
    );
  }

  // ── Cargar pedidos activos ─────────────────────────────────────────────────
  const loadOrders = useCallback(async () => {
    try {
      const results = await Promise.all(ACTIVE_STATUSES.map(s => getOrders(s)));
      setOrders(results.flat().sort((a, b) => new Date(a.created_at) - new Date(b.created_at)));
    } catch (e) {
      console.error("Error cargando pedidos:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
    // Refrescar timer para que se actualicen los "hace X min"
    timerRef.current = setInterval(() => setOrders(o => [...o]), 30000);
    return () => clearInterval(timerRef.current);
  }, [loadOrders]);

  // ── WebSocket ──────────────────────────────────────────────────────────────
  const { status: wsStatus } = useWebSocket({
    onNewOrder: loadOrders,
    onBell: (table) => {
      setBell(table);
      setTimeout(() => setBell(null), 6000);
    },
    onOrderStatusChanged: (order_id, status) => {
      if (status === "delivered" || status === "cancelled") {
        setOrders(prev => prev.filter(o => o.id !== order_id));
      } else {
        setOrders(prev => prev.map(o => o.id === order_id ? { ...o, status } : o));
      }
    },
    onOrderPaymentChanged: (order_id, payment_status) => {
      setOrders(prev => prev.map(o => o.id === order_id ? { ...o, payment_status } : o));
    },
  });

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleStatusChange = async (id, status) => {
    await patchStatus(id, status);
    if (status === "delivered" || status === "cancelled") {
      setOrders(prev => prev.filter(o => o.id !== id));
    } else {
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    }
  };

  const handlePaymentChange = async (id, payment_status) => {
    await patchPayment(id, payment_status);
    setOrders(prev => prev.map(o => o.id === id ? { ...o, payment_status } : o));
  };

  const pendingCount = orders.filter(o => o.status === "pending").length;

  return (
    <>
      <GlobalStyles />

      {bell   && <BellToast table={bell} onClose={() => setBell(null)} />}
      {ticket && <TicketModal order={ticket} onClose={() => setTicket(null)} />}

      <div style={{ display: "flex", flexDirection: "column", height: "100dvh" }}>

        {/* ── Header ── */}
        <header className="no-print" style={{
          background: "var(--black)", color: "white",
          padding: "14px 20px", flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 22 }}>🏴</span>
            <div>
              <div style={{ fontWeight: 800, fontSize: 17, letterSpacing: "-0.02em" }}>Punto Café</div>
              <div style={{ fontSize: 11, opacity: 0.5, textTransform: "uppercase", letterSpacing: "0.08em" }}>Panel Mostrador</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
              <div style={{
                width: 8, height: 8, borderRadius: "50%",
                background: wsStatus === "connected" ? "#4ade80" : "#f87171",
                animation: wsStatus === "connected" ? "pulse 2s infinite" : "none",
              }} />
              <span style={{ opacity: 0.6 }}>
                {wsStatus === "connected" ? "En vivo" : "Reconectando…"}
              </span>
            </div>
            <button
              onClick={loadOrders}
              style={{
                background: "rgba(255,255,255,0.1)", border: "none",
                color: "white", padding: "6px 12px", borderRadius: 8, fontSize: 12,
              }}
            >↻ Actualizar</button>
            <button
              onClick={handleLogout}
              style={{
                background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
                color: "rgba(255,255,255,0.6)", padding: "6px 12px", borderRadius: 8, fontSize: 12,
              }}
            >Salir</button>
          </div>
        </header>

        {/* ── Tabs ── */}
        <nav className="no-print" style={{
          display: "flex", background: "var(--bg2)",
          borderBottom: "1px solid var(--border)", flexShrink: 0,
        }}>
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                flex: 1, padding: "12px 16px", border: "none",
                background: tab === t.id ? "var(--card)" : "transparent",
                color: tab === t.id ? "var(--black)" : "var(--muted)",
                fontWeight: tab === t.id ? 700 : 400,
                fontSize: 14,
                borderBottom: tab === t.id ? "2px solid var(--black)" : "2px solid transparent",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                transition: "all 0.15s",
              }}
            >
              {t.label}
              {t.id === "orders" && pendingCount > 0 && (
                <span style={{
                  background: "var(--gold)", color: "white",
                  borderRadius: 10, padding: "1px 7px",
                  fontSize: 11, fontWeight: 700,
                }}>{pendingCount}</span>
              )}
            </button>
          ))}
        </nav>

        {/* ── Content ── */}
        <main style={{ flex: 1, overflowY: "auto" }}>
          {tab === "orders" && (
            <OrdersTab
              orders={orders}
              loading={loading}
              onStatusChange={handleStatusChange}
              onPaymentChange={handlePaymentChange}
              onPrint={setTicket}
            />
          )}
          {tab === "stock"   && <StockTab />}
          {tab === "history" && <HistoryTab onPrint={setTicket} />}
        </main>

      </div>
    </>
  );
}
