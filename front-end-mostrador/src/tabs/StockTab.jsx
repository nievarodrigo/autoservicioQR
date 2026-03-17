import { useState, useEffect } from "react";
import { getMenu, patchAvailability } from "../api";

export default function StockTab() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    getMenu().then(setCategories).finally(() => setLoading(false));
  }, []);

  const toggle = async (item) => {
    await patchAvailability(item.id, !item.is_available);
    setCategories(cats => cats.map(cat => ({
      ...cat,
      items: cat.items.map(i =>
        i.id === item.id ? { ...i, is_available: !i.is_available } : i
      ),
    })));
  };

  if (loading) return (
    <div style={{ padding: 32, textAlign: "center", color: "var(--muted)" }}>
      Cargando menú…
    </div>
  );

  return (
    <div style={{ padding: 20, maxWidth: 700, margin: "0 auto" }}>
      {categories.map(cat => (
        <div key={cat.id} style={{ marginBottom: 24 }}>
          <h3 style={{
            fontSize: 13, textTransform: "uppercase",
            letterSpacing: "0.08em", color: "var(--muted)", marginBottom: 10,
          }}>
            {cat.emoji} {cat.name}
          </h3>
          <div style={{
            background: "var(--card)", borderRadius: 12,
            border: "1px solid var(--border)", overflow: "hidden",
          }}>
            {cat.items.map((item, idx) => (
              <div key={item.id} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "11px 16px",
                borderBottom: idx < cat.items.length - 1 ? "1px solid var(--border)" : "none",
              }}>
                <span style={{
                  fontSize: 13,
                  color: item.is_available ? "var(--black)" : "var(--muted)",
                  textDecoration: item.is_available ? "none" : "line-through",
                }}>
                  {item.name}
                </span>
                <button
                  onClick={() => toggle(item)}
                  style={{
                    padding: "4px 12px", borderRadius: 6,
                    fontSize: 12, fontWeight: 600, border: "none",
                    background: item.is_available ? "var(--green-bg)" : "var(--red-bg)",
                    color: item.is_available ? "var(--green)" : "var(--red)",
                  }}
                >
                  {item.is_available ? "Disponible" : "Agotado"}
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
