export default function round(value, decimals) {
  // eslint-disable-next-line
  return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals).toFixed(decimals);
}
