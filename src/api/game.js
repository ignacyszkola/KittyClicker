import { apiFetch, USE_MOCK } from "./client";

export function normalizeGame(data = {}) {
  return {
    clicks: Number(data.clicks) || 0,
    money: Number(data.money) || 0,
    ownedCats: data.ownedCats ?? {},
    ownedUpgrades: data.ownedUpgrades ?? {},
    ownedItems: data.ownedItems ?? {},
    claimed: data.claimed ?? {},
  };
}

const MOCK_KEY = "mockGame";
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function loadGame(token) {
  if (USE_MOCK) {
    await wait(300);
    return normalizeGame(JSON.parse(localStorage.getItem(MOCK_KEY) || "{}"));
  }
  const data = await apiFetch("/api/game", { token });
  return normalizeGame(data);
}

export async function saveGame(token, state) {
  if (USE_MOCK) {
    localStorage.setItem(MOCK_KEY, JSON.stringify(state));
    return;
  }
  await apiFetch("/api/game", { token, method: "PUT", body: JSON.stringify(state) });
}

export function saveGameOnExit(token, state) {
  if (USE_MOCK) {
    localStorage.setItem(MOCK_KEY, JSON.stringify(state));
    return;
  }
  apiFetch("/api/game", {
    token,
    method: "PUT",
    body: JSON.stringify(state),
    keepalive: true,
  }).catch(() => {});
}