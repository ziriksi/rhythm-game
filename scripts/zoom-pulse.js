export default function zoomPulse(strength, time) {
  camScale(camScale().add(strength));
  let div = time * 50;
  
  let interval = setInterval(() => {
    camScale(camScale().add(-strength / div));
    div += 0.4 / time;
    
    if(camScale().x <= 1) {
      camScale(1);
      clearInterval(interval);
    }
  }, 10);
}