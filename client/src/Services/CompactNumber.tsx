export const CompactNumber = (num: number) => {
  if (num === null || num === undefined || isNaN(num)) return "";

  const abs = Math.abs(num);
  const sign = num < 0 ? "-" : "";

  if (abs >= 1_000_000_000) {
      return sign + (abs / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
  }

  if (abs >= 1_000_000) {
      return sign + (abs / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  }

  if (abs >= 1_000) {
      return sign + (abs / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  }

  return sign + abs.toFixed(2);
};