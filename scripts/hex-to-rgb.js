export default function hexToRgb(hex) {
  return color(parseInt(hex.substring(0, 2), 16), parseInt(hex.substring(2, 4), 16), parseInt(hex.substring(4, 6), 16));
}
