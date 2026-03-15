export function formatAmount(n) {
  if (n === Math.floor(n)) return n.toString();
  const frac = n - Math.floor(n);
  const whole = Math.floor(n);
  const fracs = { 0.25: "\u00BC", 0.5: "\u00BD", 0.75: "\u00BE", 0.125: "\u215B", 0.375: "\u215C", 0.625: "\u215D", 0.875: "\u215E" };
  const closest = Object.keys(fracs).reduce((best, f) => Math.abs(parseFloat(f) - frac) < Math.abs(parseFloat(best) - frac) ? f : best, "0.25");
  if (Math.abs(parseFloat(closest) - frac) < 0.06) {
    return whole > 0 ? whole + " " + fracs[closest] : fracs[closest];
  }
  return n.toFixed(2).replace(/\.?0+$/, "");
}
