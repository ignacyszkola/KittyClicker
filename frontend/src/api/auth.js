import { apiFetch, normalizeToken } from "./client";

function getUserId(token) {
  try {
    const encodedPayload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const paddedPayload = encodedPayload.padEnd(Math.ceil(encodedPayload.length / 4) * 4, "=");
    const payload = JSON.parse(atob(paddedPayload));
    const userId = Number(payload.sub);
    return Number.isSafeInteger(userId) && userId > 0 ? userId : null;
  } catch {
    return null;
  }
}

export async function registerRequest(username, password) {
  return apiFetch("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export async function loginRequest(username, password) {
  const data = await apiFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });

  const token = normalizeToken(data.token);
  return {
    ...data,
    token,
    userId: data.userId ?? getUserId(token),
    username: data.username ?? data.user?.username ?? username,
  };
}

export async function meRequest(token) {
  token = normalizeToken(token);
  const userId = getUserId(token);
  if (!userId) throw new Error("Could not read the user ID from the login token");

  const [currentUser, profile] = await Promise.all([
    apiFetch("/api/auth/me", { token }),
    apiFetch(`/api/users/${userId}`, { token }),
  ]);
  return { ...profile, ...currentUser, userId: profile.id ?? userId };
}
