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
    throw new Error("no connection with the server");
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    if (res.status === 401 && token && onUnauthorized) onUnauthorized();

    const error = new Error(data.message || "something went wrong");
    error.status = res.status;

    if (res.status === 429) {
      error.message = data.message || "you're clicking too fast buddy";
      const retry = Number(res.headers.get("Retry-After"));
      error.retryAfter = Number.isFinite(retry) && retry > 0 ? retry : null;
    }
    throw error;
  }
  return data;
}
