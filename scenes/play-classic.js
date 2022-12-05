import zoomPulse from '/scripts/zoom-pulse.js';
import constrain from '/scripts/constrain.js'
import splitSprite from '/scripts/split-sprite.js'

export default async function playClassic() {
  let frame = 0;

  const hitline = add([
    pos(width() / 2 - 48, height() - 24),
    sprite('cube-hitline'),
    z(1)
  ]);
  // Set frame to match cube perspective
  hitline.frame = constrain(Math.floor((hitline.pos.y + 16) / height() * 4), 0, 4);


  
  
  
  onUpdate(() => {
    frame++;
    if(frame % 20 == 0) {
      for(let i = 0; i < 6; i++) {
        if(chance(0.6)) continue;
        addCube(i, 'platinum');
      }
    }
    if(frame % 70 == 0) {
      zoomPulse(0.2, 0.5);
    }
  });

  onUpdate('cube', cube => {
    cube.frame = cube.baseFrame + constrain(Math.floor((cube.pos.y + 16) / height() * 4), 0, 4);
    
    if(cube.pos.y >= height() + 16) destroy(cube);
  });

  on('frame-change', 'cube', cube => {
    // Update offsets
    cube._children.forEach(c => c.use(follow(cube,
      // Yes, <quintant>-2 would be faster but this is more comprehendable imo
      vec2(0, [-2, -1, 0, 1, 2][constrain(Math.floor((cube.pos.y + 16) / height() * 4), 0, 4)])
    )));
  })
}

function addCube(lane, color) {
  const cube = add([
    pos(Math.round(width() / 2) + lane * 16 - 48, -16),
    splitSprite({
      spriteName: 'cube',
      channels: 4,
      frames: 30,
      palette: palettes[color].slice(1),
      dynamic: true
    }),
    area(),
    move(90, 50),
    'cube'
  ]);
  cube.frame = lane * 5;
  cube.baseFrame = lane * 5;
  cube._children.forEach(c => c.use(follow(cube,
    vec2(0, -2)
  )));
}