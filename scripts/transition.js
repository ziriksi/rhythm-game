export default function transition(scene) {
  let exit = false;
  every('overlay', () => exit = true);
  if(exit) return;
  
  const overlay = add([
    pos(0, 0),
    rect(width(), height()),
    color(0, 0, 0),
    opacity(0),
    stay(),
    layer('overlay'),
    'overlay'
  ]);
  overlay.opacityDelta = 0.15;

  overlay.onUpdate(() => {
    overlay.opacity += overlay.opacityDelta;
    if(overlay.opacity > 1) {
      overlay.opacity = 1;
      overlay.opacityDelta = -0.15;
      go(scene);
    }
    if(overlay.opacity < 0) {
      destroy(overlay);
    }
  });
}
