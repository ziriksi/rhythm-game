// Load background in gameplay
export default async function background(src) {
  debug.paused = true;
  const bg = await fetch(src)
    .then(res => res.text())
    .catch(() => '1');
  new Function(bg)();
  debug.paused = false;
}