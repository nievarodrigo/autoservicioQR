const API_BASE = "http://localhost:8000"; // cambiá por tu IP o URL de cloudflare

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("staff_token");
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });
  if (res.status === 401) {
    localStorage.removeItem("staff_token");
    window.dispatchEvent(new Event("auth:logout"));
    throw new Error("Sesión expirada");
  }
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function login(username, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (res.status === 401) throw new Error("Credenciales inválidas");
  if (!res.ok) throw new Error(`Error ${res.status}`);
  const data = await res.json();
  localStorage.setItem("staff_token", data.access_token);
  return data;
}

export const getOrders       = (status) => apiFetch(`/orders/${status ? `?status=${status}` : ""}`);
export const getMenu         = ()        => apiFetch("/menu/");
export const patchStatus     = (id, status)         => apiFetch(`/orders/${id}/status`,  { method: "PATCH", body: JSON.stringify({ status }) });
export const patchPayment    = (id, payment_status) => apiFetch(`/orders/${id}/payment`, { method: "PATCH", body: JSON.stringify({ payment_status }) });
export const patchAvailability = (id, is_available) => apiFetch(`/menu/items/${id}/availability?is_available=${is_available}`, { method: "PATCH" });

export { API_BASE };
