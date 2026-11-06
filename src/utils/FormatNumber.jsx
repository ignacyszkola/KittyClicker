const suffixes = ["", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No", "Dc"];

export function FormatNumber(n) {
  if (n < 1000) return Math.floor(n).toString();

  const tier = Math.min(Math.floor(Math.log10(n) / 3), suffixes.length - 1);
  const scaled = n / 10 ** (tier * 3);

  return Number(scaled.toFixed(2)) + suffixes[tier];
}