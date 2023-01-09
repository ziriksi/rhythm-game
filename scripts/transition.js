export default function transition(scene, pause) {
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
    z(100),
    'overlay'
  ]);
  overlay.opacityDelta = 0.15;

  overlay.onUpdate(() => {
    overlay.opacity += overlay.opacityDelta;
    if(overlay.opacity > 1) {
      overlay.opacity = 1;
      overlay.opacityDelta = -0.15;
      go(scene);
      debug.paused = !!pause;
      debug.stepFrame();
      overlay.opacity = 1;
    }
    if(overlay.opacity < 0) {
      destroy(overlay);
    }
  });
}
