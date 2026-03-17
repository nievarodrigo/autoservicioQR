import { useState, useEffect, useCallback } from "react";

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const API_BASE = "http://localhost:8000";

function getTableToken() {
  const params = new URLSearchParams(window.location.search);
  return params.get("token") || "DEMO_TOKEN";
}

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
  --black:   #f5f0e8;   /* fondo crema */
  --dark:    #ede8de;
  --card:    #e8e2d6;
  --border:  #d4cfc4;
  --cream:   #1a1814;   /* texto oscuro */
  --cream2:  #3a3530;
  --accent:  #1a1814;   /* acento negro */
  --accent2: #3a3530;
  --muted:   #7a7060;
        }

    html { font-size: 16px; -webkit-tap-highlight-color: transparent; }

    body {
      background: var(--black);
      color: var(--text);
      font-family: var(--font-body);
      font-weight: 300;
      min-height: 100dvh;
      overscroll-behavior: none;
    }

    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    @keyframes slideUp {
      from { transform: translateY(100%); opacity: 0; }
      to   { transform: translateY(0);    opacity: 1; }
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .fade-up  { animation: fadeUp 0.4s ease both; }
    .fade-in  { animation: fadeIn 0.3s ease both; }
    .slide-up { animation: slideUp 0.45s cubic-bezier(0.16,1,0.3,1) both; }

    .stagger > * { animation: fadeUp 0.4s ease both; }
    .stagger > *:nth-child(1)  { animation-delay: 0.05s; }
    .stagger > *:nth-child(2)  { animation-delay: 0.10s; }
    .stagger > *:nth-child(3)  { animation-delay: 0.15s; }
    .stagger > *:nth-child(4)  { animation-delay: 0.20s; }
    .stagger > *:nth-child(5)  { animation-delay: 0.25s; }
    .stagger > *:nth-child(6)  { animation-delay: 0.30s; }
    .stagger > *:nth-child(7)  { animation-delay: 0.35s; }
    .stagger > *:nth-child(8)  { animation-delay: 0.40s; }
    .stagger > *:nth-child(9)  { animation-delay: 0.45s; }
    .stagger > *:nth-child(n+10) { animation-delay: 0.50s; }
  `}</style>
);

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const formatPrice = (n) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency", currency: "ARS", maximumFractionDigits: 0,
  }).format(n);

// ─── API ──────────────────────────────────────────────────────────────────────
async function fetchMenu() {
  const res = await fetch(`${API_BASE}/menu/`);
  if (!res.ok) throw new Error("No se pudo cargar el menú");
  return res.json();
}

async function fetchTableByToken(token) {
  const res = await fetch(`${API_BASE}/tables/by-token/${token}`);
  if (!res.ok) throw new Error("Mesa no encontrada");
  return res.json();
}

async function postOrder(tableToken, payload) {
  const res = await fetch(`${API_BASE}/orders/?table_token=${tableToken}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Error al enviar el pedido");
  }
  return res.json();
}

// ─── SPINNER ──────────────────────────────────────────────────────────────────
const Spinner = () => (
  <div style={{
    display: "flex", justifyContent: "center", alignItems: "center",
    minHeight: "100dvh", flexDirection: "column", gap: 16,
  }}>
    <div style={{
      width: 36, height: 36, border: "2px solid var(--border)",
      borderTop: "2px solid var(--accent)", borderRadius: "50%",
      animation: "spin 0.8s linear infinite",
    }} />
    <span style={{ color: "var(--muted)", fontSize: 13 }}>Cargando…</span>
  </div>
);

// ─── TAG ──────────────────────────────────────────────────────────────────────
const Tag = ({ label }) => {
  const colors = {
    "sin tacc": { bg: "#1a2a1a", color: "#6abf6a", border: "#2d4a2d" },
    "vegano":   { bg: "#1a2420", color: "#5ab896", border: "#2a4038" },
  };
  const c = colors[label] || { bg: "var(--tag-bg)", color: "var(--cream2)", border: "var(--border)" };
  return (
    <span style={{
      fontSize: 10, fontWeight: 500, letterSpacing: "0.05em",
      textTransform: "uppercase", padding: "2px 7px", borderRadius: 4,
      background: c.bg, color: c.color, border: `1px solid ${c.border}`,
      whiteSpace: "nowrap",
    }}>
      {label}
    </span>
  );
};

// ─── CATEGORY NAV ─────────────────────────────────────────────────────────────
const CategoryNav = ({ categories, active, onSelect }) => (
  <div style={{
    display: "flex", gap: 8, overflowX: "auto",
    padding: "0 16px 12px", scrollbarWidth: "none",
  }}>
    {categories.map((cat) => (
      <button
        key={cat.id}
        onClick={() => onSelect(cat.id)}
        style={{
          flexShrink: 0, padding: "6px 14px", borderRadius: 20,
          border: active === cat.id ? "1px solid var(--accent)" : "1px solid var(--border)",
          background: active === cat.id ? "var(--accent)" : "transparent",
          color: active === cat.id ? "var(--black)" : "var(--cream2)",
          fontSize: 12, fontWeight: active === cat.id ? 500 : 400,
          fontFamily: "var(--font-body)", cursor: "pointer",
          transition: "all 0.2s ease", whiteSpace: "nowrap",
        }}
      >
        {cat.emoji} {cat.name}
      </button>
    ))}
  </div>
);

// ─── MENU CARD ────────────────────────────────────────────────────────────────
const MenuCard = ({ item, qty, onAdd, onRemove }) => (
  <div style={{
    display: "flex", alignItems: "flex-start", gap: 12,
    padding: "14px 16px", borderBottom: "1px solid var(--border)",
  }}>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 3 }}>
        <span style={{ fontFamily: "var(--font-display)", fontSize: 15, color: "var(--cream)", lineHeight: 1.3 }}>
          {item.name}
        </span>
        {item.tag && <Tag label={item.tag} />}
      </div>
      {item.description && (
        <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5, marginBottom: 6 }}>
          {item.description}
        </p>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ color: "var(--accent)", fontWeight: 500, fontSize: 14 }}>
          {formatPrice(item.price)}
        </span>
        {item.price_large && (
          <span style={{ color: "var(--muted)", fontSize: 12 }}>
            / {formatPrice(item.price_large)} grande
          </span>
        )}
      </div>
    </div>

    <div style={{ display: "flex", alignItems: "center", gap: 0, flexShrink: 0 }}>
      {qty > 0 ? (
        <>
          <button onClick={onRemove} style={counterBtn("minus")}>−</button>
          <span style={{
            minWidth: 28, textAlign: "center", fontSize: 15,
            fontWeight: 500, color: "var(--cream)",
          }}>{qty}</span>
          <button onClick={onAdd} style={counterBtn("plus")}>+</button>
        </>
      ) : (
        <button onClick={onAdd} style={{
          width: 32, height: 32, borderRadius: 8,
          border: "1px solid var(--border)", background: "var(--card)",
          color: "var(--accent)", fontSize: 20, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>+</button>
      )}
    </div>
  </div>
);

function counterBtn(type) {
  return {
    width: 30, height: 30, borderRadius: 8,
    border: "1px solid var(--border)",
    background: type === "plus" ? "var(--accent)" : "var(--card)",
    color: type === "plus" ? "var(--black)" : "var(--cream2)",
    fontSize: 18, cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
  };
}

// ─── CART BAR ─────────────────────────────────────────────────────────────────
const CartBar = ({ count, total, onClick }) => (
  <div style={{
    position: "fixed", bottom: 0, left: 0, right: 0,
    padding: "12px 16px", paddingBottom: "calc(12px + env(safe-area-inset-bottom))",
    background: "linear-gradient(to top, var(--black) 70%, transparent)",
    zIndex: 50,
  }}>
    <button onClick={onClick} style={{
      width: "100%", padding: "14px 20px", borderRadius: 14, border: "none",
      background: "linear-gradient(135deg, var(--accent) 0%, var(--accent2) 100%)",
      color: "var(--black)", fontSize: 15, fontWeight: 500,
      fontFamily: "var(--font-body)", cursor: "pointer",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      boxShadow: "0 4px 24px rgba(212,168,83,0.3)",
    }}>
      <span style={{
        background: "rgba(0,0,0,0.2)", borderRadius: 8,
        padding: "2px 9px", fontSize: 13, fontWeight: 600,
      }}>{count} {count === 1 ? "item" : "items"}</span>
      <span style={{ fontFamily: "var(--font-display)", fontSize: 16 }}>Ver pedido</span>
      <span style={{ fontWeight: 600 }}>{formatPrice(total)}</span>
    </button>
  </div>
);

// ─── CART DRAWER ──────────────────────────────────────────────────────────────
const CartDrawer = ({ cart, categories, onClose, onConfirm }) => {
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [notes, setNotes] = useState("");

  const itemsMap = {};
  categories.forEach((cat) => cat.items.forEach((i) => (itemsMap[i.id] = i)));

  const cartItems = Object.entries(cart)
    .filter(([, qty]) => qty > 0)
    .map(([id, qty]) => ({ item: itemsMap[id], qty }));

  const total = cartItems.reduce((sum, { item, qty }) => sum + item.price * qty, 0);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", flexDirection: "column" }}>
      <div onClick={onClose} style={{
        position: "absolute", inset: 0,
        background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)",
      }} />
      <div className="slide-up" style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        background: "var(--dark)", borderRadius: "20px 20px 0 0",
        border: "1px solid var(--border)", borderBottom: "none",
        maxHeight: "90dvh", display: "flex", flexDirection: "column",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}>
        {/* Handle */}
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 0" }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: "var(--border)" }} />
        </div>

        {/* Header */}
        <div style={{
          padding: "12px 20px 16px", borderBottom: "1px solid var(--border)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "var(--cream)" }}>Tu pedido</h2>
          <button onClick={onClose} style={{
            background: "none", border: "none", color: "var(--muted)",
            fontSize: 22, cursor: "pointer", padding: 4,
          }}>✕</button>
        </div>

        {/* Items */}
        <div style={{ overflowY: "auto", flex: 1 }}>
          {cartItems.map(({ item, qty }) => (
            <div key={item.id} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "12px 20px", borderBottom: "1px solid var(--border)",
            }}>
              <div>
                <div style={{ fontSize: 14, color: "var(--cream)", fontFamily: "var(--font-display)" }}>{item.name}</div>
                <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>x{qty} · {formatPrice(item.price)} c/u</div>
              </div>
              <span style={{ color: "var(--accent)", fontWeight: 500, fontSize: 14 }}>
                {formatPrice(item.price * qty)}
              </span>
            </div>
          ))}

          {/* Payment method */}
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
            <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)", marginBottom: 10 }}>
              Método de pago
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              {[
                { value: "cash",    label: "💵 Efectivo",  sub: "Pagás al recibir" },
                { value: "digital", label: "📱 Digital",   sub: "Transferencia / QR" },
              ].map((opt) => (
                <button key={opt.value} onClick={() => setPaymentMethod(opt.value)} style={{
                  flex: 1, padding: "10px 12px", borderRadius: 10, cursor: "pointer",
                  border: paymentMethod === opt.value ? "1.5px solid var(--accent)" : "1px solid var(--border)",
                  background: paymentMethod === opt.value ? "rgba(212,168,83,0.08)" : "var(--card)",
                  textAlign: "left", transition: "all 0.15s",
                }}>
                  <div style={{ fontSize: 13, color: "var(--cream)", fontFamily: "var(--font-body)", marginBottom: 2 }}>{opt.label}</div>
                  <div style={{ fontSize: 11, color: "var(--muted)" }}>{opt.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div style={{ padding: "16px 20px" }}>
            <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)", marginBottom: 8 }}>
              Aclaraciones (opcional)
            </p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej: sin azúcar, alergia al maní…"
              rows={2}
              style={{
                width: "100%", background: "var(--card)", border: "1px solid var(--border)",
                borderRadius: 10, color: "var(--cream)", fontSize: 13,
                fontFamily: "var(--font-body)", padding: "10px 12px",
                resize: "none", outline: "none",
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "12px 20px 16px", borderTop: "1px solid var(--border)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ color: "var(--muted)", fontSize: 13 }}>Total</span>
            <span style={{ color: "var(--cream)", fontFamily: "var(--font-display)", fontSize: 18 }}>
              {formatPrice(total)}
            </span>
          </div>
          <button
            onClick={() => onConfirm({ paymentMethod, notes })}
            style={{
              width: "100%", padding: "15px", borderRadius: 12, border: "none",
              background: "linear-gradient(135deg, var(--accent), var(--accent2))",
              color: "var(--black)", fontSize: 15, fontWeight: 600,
              fontFamily: "var(--font-body)", cursor: "pointer",
              boxShadow: "0 4px 20px rgba(212,168,83,0.25)",
            }}
          >
            Confirmar pedido
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── SUCCESS SCREEN ───────────────────────────────────────────────────────────
const SuccessScreen = ({ order, tableNumber }) => (
  <div className="fade-in" style={{
    minHeight: "100dvh", display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center", padding: 32, textAlign: "center",
  }}>
    <div style={{
      width: 80, height: 80, borderRadius: "50%",
      background: "linear-gradient(135deg, var(--accent), var(--accent2))",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 36, marginBottom: 24,
      boxShadow: "0 0 40px rgba(212,168,83,0.3)",
    }}>☕</div>

    <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, color: "var(--cream)", marginBottom: 8 }}>
      ¡Pedido enviado!
    </h1>
    <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.6, marginBottom: 32, maxWidth: 280 }}>
      Tu pedido #{order.id} fue recibido. Lo preparamos y te lo llevamos a la{" "}
      <strong style={{ color: "var(--accent)" }}>Mesa {tableNumber}</strong>.
    </p>

    <div style={{
      background: "var(--card)", border: "1px solid var(--border)",
      borderRadius: 14, padding: "16px 24px", width: "100%", maxWidth: 300, marginBottom: 24,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ color: "var(--muted)", fontSize: 13 }}>Estado</span>
        <span style={{
          background: "rgba(212,168,83,0.15)", color: "var(--accent)",
          fontSize: 12, padding: "2px 10px", borderRadius: 6, fontWeight: 500,
        }}>Recibido ✓</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ color: "var(--muted)", fontSize: 13 }}>Total</span>
        <span style={{ color: "var(--cream)", fontFamily: "var(--font-display)", fontSize: 16 }}>
          {formatPrice(order.total)}
        </span>
      </div>
      {order.payment_method === "cash" && (
        <p style={{ marginTop: 10, fontSize: 12, color: "var(--muted)", borderTop: "1px solid var(--border)", paddingTop: 10 }}>
          💵 Pagás en efectivo al recibir tu pedido
        </p>
      )}
      {order.payment_method === "digital" && (
        <p style={{ marginTop: 10, fontSize: 12, color: "var(--muted)", borderTop: "1px solid var(--border)", paddingTop: 10 }}>
          📱 Un momento, te acercamos el QR de pago
        </p>
      )}
    </div>

    <p style={{ fontSize: 12, color: "var(--muted)" }}>Relajate, en breve llega 🙌</p>
  </div>
);

// ─── ERROR SCREEN ─────────────────────────────────────────────────────────────
const ErrorScreen = ({ message, onRetry }) => (
  <div style={{
    minHeight: "100dvh", display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center", padding: 32, textAlign: "center",
  }}>
    <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
    <h2 style={{ fontFamily: "var(--font-display)", color: "var(--cream)", marginBottom: 8 }}>Algo salió mal</h2>
    <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 24 }}>{message}</p>
    <button onClick={onRetry} style={{
      padding: "10px 24px", borderRadius: 10, border: "1px solid var(--accent)",
      background: "transparent", color: "var(--accent)", fontSize: 14,
      fontFamily: "var(--font-body)", cursor: "pointer",
    }}>Reintentar</button>
  </div>
);

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [phase, setPhase] = useState("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const [categories, setCategories] = useState([]);
  const [table, setTable] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [cart, setCart] = useState({});
  const [cartOpen, setCartOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const token = getTableToken();

  const load = useCallback(async () => {
    setPhase("loading");
    try {
      const [menuData, tableData] = await Promise.all([
        fetchMenu(),
        fetchTableByToken(token),
      ]);
      setCategories(menuData);
      setTable(tableData);
      setActiveCategory(menuData[0]?.id ?? null);
      setPhase("menu");
    } catch (e) {
      setErrorMsg(e.message);
      setPhase("error");
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const addItem    = (id) => setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const removeItem = (id) => setCart((c) => {
    const next = { ...c, [id]: (c[id] || 0) - 1 };
    if (next[id] <= 0) delete next[id];
    return next;
  });

  const allItems   = categories.flatMap((c) => c.items);
  const cartCount  = Object.values(cart).reduce((s, v) => s + v, 0);
  const cartTotal  = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = allItems.find((i) => i.id === parseInt(id));
    return sum + (item ? item.price * qty : 0);
  }, 0);

  const handleConfirm = async ({ paymentMethod, notes }) => {
    const payload = {
      payment_method: paymentMethod,
      notes: notes || null,
      items: Object.entries(cart).map(([id, qty]) => ({
        menu_item_id: parseInt(id),
        quantity: qty,
      })),
    };
    try {
      const order = await postOrder(token, payload);
      setConfirmedOrder(order);
      setCartOpen(false);
      setPhase("success");
    } catch (e) {
      alert("Error al enviar el pedido: " + e.message);
    }
  };

  const activeCat = categories.find((c) => c.id === activeCategory);

  if (phase === "loading") return <><GlobalStyles /><Spinner /></>;
  if (phase === "error")   return <><GlobalStyles /><ErrorScreen message={errorMsg} onRetry={load} /></>;
  if (phase === "success") return <><GlobalStyles /><SuccessScreen order={confirmedOrder} tableNumber={table?.number} /></>;

  return (
    <>
      <GlobalStyles />

      {/* HEADER */}
      <header style={{
        position: "sticky", top: 0, zIndex: 40,
        background: "var(--black)", borderBottom: "1px solid var(--border)",
        padding: "14px 16px 0",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div>
            <div style={{
              fontFamily: "var(--font-display)", fontSize: 22, fontStyle: "italic",
              color: "var(--cream)", letterSpacing: "-0.01em", lineHeight: 1,
            }}>
              Punto Café
            </div>
            <div style={{ fontSize: 11, color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 2 }}>
              Mesa {table?.number}
            </div>
          </div>
          <div style={{
            width: 40, height: 40, borderRadius: "50%",
            background: "var(--cream)", display: "flex",
            alignItems: "center", justifyContent: "center", fontSize: 18,
            boxShadow: "0 0 0 1px var(--border)",
          }}>🏴</div>
        </div>
        <CategoryNav categories={categories} active={activeCategory} onSelect={setActiveCategory} />
      </header>

      {/* MENU */}
      <main style={{ paddingBottom: cartCount > 0 ? 100 : 24 }}>
        {activeCat && (
          <div key={activeCat.id}>
            <div style={{ padding: "16px 16px 4px", borderBottom: "1px solid var(--border)" }}>
              <h2 style={{
                fontFamily: "var(--font-display)", fontSize: 20,
                color: "var(--cream)", fontStyle: "italic",
              }}>
                {activeCat.emoji} {activeCat.name}
              </h2>
            </div>
            <div className="stagger">
              {activeCat.items.map((item) => (
                <MenuCard
                  key={item.id}
                  item={item}
                  qty={cart[item.id] || 0}
                  onAdd={() => addItem(item.id)}
                  onRemove={() => removeItem(item.id)}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* CART BAR */}
      {cartCount > 0 && (
        <CartBar count={cartCount} total={cartTotal} onClick={() => setCartOpen(true)} />
      )}

      {/* CART DRAWER */}
      {cartOpen && (
        <CartDrawer
          cart={cart}
          categories={categories}
          onClose={() => setCartOpen(false)}
          onConfirm={handleConfirm}
        />
      )}
    </>
  );
}
