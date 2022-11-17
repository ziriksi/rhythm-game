export default function constrain(x, min, max) {
  return Math.max(min, Math.min(max, x));
}