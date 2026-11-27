let onUnauthorized = null;

export function setUnauthorizedHandler(fn) {
  onUnauthorized = fn;
}

export function normalizeToken(token) {
  return typeof token === "string" ? token.trim().replace(/^Bearer\s+/i, "") : "";
}

export async function apiFetch(url, { token, keepalive, headers, ...options } = {}) {
  const allHeaders = { "Content-Type": "application/json", ...headers };
  const isPublicAuthRequest =
    url === "/api/auth/login" || url === "/api/auth/register";
  const isPublicStatusRequest = url === "/api/users/status";
  const storedToken =
    !isPublicAuthRequest && typeof localStorage !== "undefined"
      ? localStorage.getItem("token")
      : null;
  const requestToken = normalizeToken(token) || normalizeToken(storedToken);
  if (
    url.startsWith("/api/") &&
    !isPublicAuthRequest &&
    !isPublicStatusRequest &&
    !requestToken
  ) {
    if (onUnauthorized) onUnauthorized();
    throw new Error("Brak tokenu logowania. Zaloguj się ponownie.");
  }
  if (requestToken) allHeaders.Authorization = `Bearer ${requestToken}`;

  let res;
  try {
    res = await fetch(url, { ...options, headers: allHeaders, keepalive });
  } catch {
    throw new Error("no connection with the server");
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    if (res.status === 401 && requestToken && onUnauthorized) onUnauthorized();

    const validationMessage = data.errors
      ? Object.values(data.errors).find((message) => typeof message === "string")
      : null;
    const defaultMessage = res.status === 403
      ? `Brak uprawnień (403; ${requestToken ? "JWT wysłany" : "bez JWT"})`
      : `Żądanie nie powiodło się (${res.status})`;
    const error = new Error(validationMessage || data.message || defaultMessage);
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
