export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== "false";

let onUnauthorized = null;

export function setUnauthorizedHandler(fn) {
  onUnauthorized = fn;
}

export async function apiFetch(url, { token, keepalive, headers, ...options } = {}) {
  const allHeaders = { "Content-Type": "application/json", ...headers };
  if (token) allHeaders.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(url, { ...options, headers: allHeaders, keepalive });
  } catch {
    throw new Error("no connect with te server");
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    if (res.status === 401 && token && onUnauthorized) onUnauthorized();

    const error = new Error(data.message || "error");
    error.status = res.status;
    throw error;
  }
  return data;
}
