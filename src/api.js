const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
export async function request(path, options = {}) {
  const headers = { ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }), ...options.headers };
  const token = localStorage.getItem('library_token'); if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  const payload = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) { const error = payload?.error || payload; throw Object.assign(new Error(error?.message || 'No fue posible completar la operación.'), { status: response.status, code: error?.code }); }
  return payload;
}
export function login(username, password) { return request('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) }); }
export function logout() { localStorage.removeItem('library_token'); localStorage.removeItem('library_role'); }
