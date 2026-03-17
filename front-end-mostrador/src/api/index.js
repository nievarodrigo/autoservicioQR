const API_BASE = "http://localhost:8000"; // cambiá por tu IP o URL de cloudflare

export async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export const getOrders       = (status) => apiFetch(`/orders/${status ? `?status=${status}` : ""}`);
export const getMenu         = ()        => apiFetch("/menu/");
export const patchStatus     = (id, status)         => apiFetch(`/orders/${id}/status`,  { method: "PATCH", body: JSON.stringify({ status }) });
export const patchPayment    = (id, payment_status) => apiFetch(`/orders/${id}/payment`, { method: "PATCH", body: JSON.stringify({ payment_status }) });
export const patchAvailability = (id, is_available) => apiFetch(`/menu/items/${id}/availability?is_available=${is_available}`, { method: "PATCH" });

export { API_BASE };
