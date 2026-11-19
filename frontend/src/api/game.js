import { apiFetch, USE_MOCK } from "./client";

export function normalizeGame(data = {}) {
  return {
    clicks: Number(data.points) || 0,
    money: Number(data.money) || 0,
    ownedCats: data.ownedCats ?? {},
    ownedUpgrades: data.ownedUpgrades ?? {},
    ownedItems: data.ownedItems ?? {},
    claimed: data.claimed ?? {},
    selectedCatId: data.selectedCatId ?? "default",
  };
}

export function toSaveBody(state) {
  return {
    points: state.clicks,
    money: state.money,
    ownedCats: state.ownedCats,
    ownedUpgrades: state.ownedUpgrades,
    ownedItems: state.ownedItems,
    claimed: state.claimed,
    selectedCatId: state.selectedCatId,
  };
}

const MOCK_KEY = "mockGame";
const MOCK_COUNT_KEY = "mockClickCount";
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function loadGame(token) {
  if (USE_MOCK) {
    await wait(300);
    const stored = JSON.parse(localStorage.getItem(MOCK_KEY) || "{}");
    const count = Number(localStorage.getItem(MOCK_COUNT_KEY)) || 0;
    return normalizeGame({ ...stored, clicks: count });
  }
  const data = await apiFetch("/api/game", { token });
  return normalizeGame(data);
}

export async function saveGame(token, state) {
  const body = toSaveBody(state);
  if (USE_MOCK) {
    localStorage.setItem(MOCK_KEY, JSON.stringify(body));
    return;
  }
  await apiFetch("/api/game", { token, method: "PUT", body: JSON.stringify(body) });
}

export function saveGameOnExit(token, state) {
  const body = toSaveBody(state);
  if (USE_MOCK) {
    localStorage.setItem(MOCK_KEY, JSON.stringify(body));
    return;
  }
  apiFetch("/api/game", {
    token,
    method: "PUT",
    body: JSON.stringify(body),
    keepalive: true,
  }).catch(() => {});
}

const mockClickTimes = [];

export async function sendClick(token) {
  if (USE_MOCK) {
    const now = performance.now();
    while (mockClickTimes.length && now - mockClickTimes[0] >= 1000) mockClickTimes.shift();

    if (mockClickTimes.length >= 15) {
      const error = new Error("Maximum of 15 clicks per second exceeded");
      error.status = 429;
      throw error;
    }
    mockClickTimes.push(now);
    localStorage.setItem(MOCK_COUNT_KEY, String((Number(localStorage.getItem(MOCK_COUNT_KEY)) || 0) + 1));
    return;
  }
  await apiFetch("/api/click", { token, method: "POST" });
}