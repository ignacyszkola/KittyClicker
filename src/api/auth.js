import { apiFetch, USE_MOCK } from "./client";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function registerRequest(username, password) {
  if (USE_MOCK) {
    await wait(400);
    return {};
  }
  return apiFetch("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export async function loginRequest(username, password) {
  if (USE_MOCK) {
    await wait(400);
    localStorage.setItem("mockUser", username);
    return { token: "fake-token", user: { username } };
  }
  return apiFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export async function meRequest(token) {
  if (USE_MOCK) {
    await wait(200);
    return { username: localStorage.getItem("mockUser") || "gracz" };
  }
  return apiFetch("/api/auth/me", { token });
}
