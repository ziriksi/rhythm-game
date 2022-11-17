export default function zoomPulse(strength, time) {
  camScale(camScale().add(vec2(strength)));
  let div = time * 50;
  
  let interval = setInterval(() => {
    camScale(camScale().add(vec2(-strength / div)));
    div += 0.4 / time;
    debug.log(camScale().x)
    if(camScale().x <= 1) {
      camScale(vec2(1, 1));
      clearInterval(interval);
    }
  }, 10);
}