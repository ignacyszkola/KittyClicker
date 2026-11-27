import { apiFetch } from "./client";

const gameTypeKeys = {
  clickCat: "POINTS_PER_CLICK",
  multiCat: "PASSIVE_CAT",
  moneyMultiCat: "MONEY_MULTIPLIER",
  critMultiCat: "CRIT_MULTIPLIER",
  critChanceMultiCat: "CRIT_CHANCE",
  moneyDropChanceCat: "MONEY_CHANCE",
};

const skinIdsByPath = {
  "../assets/cat.png": 1,
  "../assets/flop.webp": 2,
  "../assets/pope.webp": 3,
};

function unwrap(data, key) {
  const value = data?.[key];
  return value && typeof value === "object" && key in value ? value[key] : value ?? {};
}

function normalizeItems(items) {
  return Object.entries(items).reduce((result, [name, count]) => {
    const itemName = name.toLowerCase();
    const key = itemName.includes("krem")
      ? "kremowka"
      : itemName.includes("boost")
        ? "boost"
        : null;
    if (key) result[key] = Number(count) || 0;
    return result;
  }, {});
}

function normalizeAchievements(achievements) {
  return Object.entries(achievements).reduce((result, [name, claimed]) => {
    if (!claimed) return result;

    if (name.toLowerCase().includes("krem")) {
      result["2137clicks"] = true;
      return result;
    }

    const clicks = Number(name.match(/\d+/)?.[0]);
    if (clicks === 2137) result["2137clicks"] = true;
    else if (clicks > 0 && Number.isInteger(Math.log10(clicks))) {
      result[`clicks-1e${Math.log10(clicks)}`] = true;
    }
    return result;
  }, {});
}

export function normalizeGame(data = {}) {
  const points = unwrap(data, "points");
  const money = unwrap(data, "money");
  const cats = unwrap(data, "ownedCats");
  const upgrades = unwrap(data, "ownedUpgrades");
  const items = unwrap(data, "ownedItems");
  const achievements = unwrap(data, "claimedAchievements");
  const selectedCat = unwrap(data, "selectedCat");
  const ownedSelectCats = unwrap(data, "ownedSelectCats");

  const ownedCats = {};
  const ownedUpgrades = {};
  for (const [key, type] of Object.entries(gameTypeKeys)) {
    ownedCats[key] = Boolean(cats[type]);
    ownedUpgrades[key] = ownedCats[key]
      ? Math.max(0, (Number(upgrades[type]) || 1) - 1)
      : 0;
  }

  return {
    clicks: Number(points.points ?? data.clicks ?? points) || 0,
    money: Number(money.money ?? data.totalMoney ?? money) || 0,
    ownedCats,
    ownedUpgrades,
    ownedItems: normalizeItems(items),
    claimedAchievements: normalizeAchievements(achievements),
    selectedCatId: typeof selectedCat === "string" && selectedCat ? selectedCat : "default",
    ownedSelectCats,
  };
}

export async function loadGame(token) {
  return normalizeGame(await apiFetch("/api/game", { token }));
}

export async function buyCat(token, userId, type) {
  return apiFetch(`/api/users/${userId}/cats`, {
    token,
    method: "POST",
    body: JSON.stringify(type),
  });
}

export async function upgradeCat(token, userId, type) {
  return apiFetch(`/api/users/${userId}/upgrades`, {
    token,
    method: "POST",
    body: JSON.stringify(type),
  });
}

export async function useItem(token, userId, itemId) {
  return apiFetch(`/api/users/${userId}/items/${itemId}/use`, {
    token,
    method: "POST",
  });
}

export async function selectSkin(token, userId, skinPath) {
  const skinId = skinIdsByPath[skinPath];
  if (!skinId) throw new Error("Unknown cat skin path");

  return apiFetch(`/api/users/${userId}/skin`, {
    token,
    method: "PATCH",
    body: JSON.stringify(skinId),
  });
}

export function sendClick(token) {
  return apiFetch("/api/clicks", { token, method: "POST" });
}
