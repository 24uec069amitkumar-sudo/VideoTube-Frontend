export const API = `${import.meta.env.VITE_API_URL || ""}/api/v1`;
export const token = () => localStorage.getItem("accessToken");
export async function request(path, options = {}) {
  const headers = new Headers(options.headers || {});
  if (token()) headers.set("Authorization", `Bearer ${token()}`);
  if (options.body && !(options.body instanceof FormData) && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  const response = await fetch(`${API}${path}`, { credentials: "include", ...options, headers });
  const raw = await response.text();
  let result = {}; try { result = raw ? JSON.parse(raw) : {}; } catch { throw new Error(`Server returned an unexpected response (${response.status}). Check that the backend is running and the route exists.`); }
  if (response.status === 401 && token()) { localStorage.removeItem("accessToken"); localStorage.removeItem("currentUser"); }
  if (!response.ok) throw new Error(result.message || `Request failed (${response.status})`);
  return result;
}
export const dataOf = (r) => r?.data ?? {};
export const videoListOf = (r) => { const d=dataOf(r); if(Array.isArray(d)) return d; return d.videos || d.docs || d.results || []; };
export const userOf = () => { try { return JSON.parse(localStorage.getItem("currentUser") || "null"); } catch { return null; } };
