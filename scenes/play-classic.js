import Cube from '../scripts/cube.js';
import zoomPulse from '../scripts/zoom-pulse.js';

export default async function playClassic() {
  let frame = 0;
  onUpdate(() => {
    frame++;
    if(frame % 20 == 0) {
      for(let i = 0; i < 6; i++) {
        if(chance(0.5)) continue;
        new Cube(i, 'platinum');
      }
    }
    if(frame % 70 == 0) {
      zoomPulse(0.2, 0.5);
    }
  });
}

