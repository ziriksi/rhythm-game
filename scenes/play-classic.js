import zoomPulse from '/scripts/zoom-pulse.js';
import constrain from '/scripts/constrain.js';
import splitSprite from '/scripts/split-sprite.js';
import background from '/scripts/background.js';

export default async function playClassic() {
  let frame = 0;
  const keys = 'sdfjkl';

  load(background('/backgrounds/defrault.js'));

  const hitline = add([
    pos(width() / 2 - 48, height() - 24),
    sprite('cube-hitline'),
    area(),
    z(1),
    'hitline'
  ]);
  // Set frame to match cube perspective
  hitline.frame = constrain(Math.floor((hitline.pos.y + 16) / height() * 4), 0, 4);

  const getCubeDistance = cube => Math.abs(cube.pos.y - (hitline.pos.y - cube.perspective));
  
  onUpdate('debris', debris => {
    debris.moveBy(debris.vel);
    debris.vel = debris.vel.add(0, 0.1);
  });


  for(const lane in keys) {
    onKeyPress(keys[lane], () => {
      let hit = false;
      every('lane' + lane, cube => {
        if(hit) return; // Only hit one cube per key press
        if(cube.isColliding(hitline)) {
          hitCube(cube, getCubeDistance(cube));
          hit = true;
        };
      });
      if(!hit) debug.log('miss');
    });
  }
  
  onUpdate(() => {
    frame++;
    if(frame % 20 == 0) {
      for(let i = 1; i < 5; i++) {
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
    
    if(cube.pos.y >= height() + 16) cube.destroy();
    //if(cube.pos.y >= hitline.pos.y - cube.perspective) hitCube(cube, getCubeDistance(cube))
    //if(cube.isColliding(hitline)) hitCube(cube, getCubeDistance(cube))
  });

  on('frame-change', 'cube', cube => {
    // Update offsets
    cube.perspective = [-2, -1, 0, 1, 2][constrain(Math.floor((cube.pos.y + 16) / height() * 4), 0, 4)];
    cube._children.forEach(c => c.use(follow(cube,
      // Yes, <quintant>-2 would be faster but this is more comprehendable imo
      vec2(0, cube.perspective)
    )));
    
  })
}

function addCube(lane, color) {
  const cube = add([
    pos(Math.round(width() / 2) + lane * 16 - 48, -16),
    splitSprite({
      spriteName: 'cube',
      palette: palettes[color].slice(1),
      dynamic: true
    }),
    area(),
    move(90, 50),
    'cube',
    'lane' + lane
  ]);
  cube.frame = lane * 5;
  cube.baseFrame = lane * 5;
  cube.each(c => c.use(follow(cube,
    vec2(0, -2)
  )));
}

function hitCube(cube, distance) {
  if(cube.isHit) return;
  cube.isHit = true;
  
  cube.use(move(0, 0));
  cube.each(c => c.use(color(255, 255, 255))); // Whiten

  wait(0.05, () => {
    // Create debris
    for(let i = 0; i < 5; i++) {
      const debris = add([
        pos(cube.pos.add(6, 6)),
        area(),
        splitSprite({
          spriteName: 'debris',
          palette: [palettes['platinum'][0], palettes['platinum'][2], palettes['platinum'][4]],
          dynamic: true
        }),
        cleanup(),
        'debris'
      ]);
      debris.frame = randi(0, 3);
      debris.vel = Vec2.fromAngle(randi(0, 360));
      debris.each(c => c.use(z(2)));
    }

    const score = Math.round(100 - distance * 4); // Min: 36 Max: 100
    debug.log(score);
    cube.destroy();
  });
}
