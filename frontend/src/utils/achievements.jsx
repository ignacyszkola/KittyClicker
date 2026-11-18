export const singleCompleteAchievements = [
  { id: "2137clicks", name: "2137", description: "Zdobądź 2137 kliknięć", goal: 2137, reward: "kremowka" },
];

export function infiniteAchievement(n) {
  return { id: `clicks-1e${n}`, power: n, goal: 10 ** n, reward: "boost"};
}

export function reachedAchievementLvl(clicks) {
  let n = 0;
  while (n < 308 && 10 ** (n + 1) <= clicks) n++;
  return n;
}