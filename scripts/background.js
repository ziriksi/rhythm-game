export default async function background(src) {
  debug.paused = true;
  const bg = await fetch(src).then(res => res.text());
  new Function(bg)();
  debug.paused = false;
}