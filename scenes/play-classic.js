import zoomPulse from '/scripts/zoom-pulse.js';
import constrain from '/scripts/constrain.js';
import splitSprite from '/scripts/split-sprite.js';
import background from '/scripts/background.js';

export default async function playClassic() {
  layers([
    'bg',
    'fg',
    'overlay'
  ], 'fg');
  
  let frame = 0;
  const keys = 'sdfjkl';
  let score = 0;
  let maxScore = 0;
  let cubesHit = 0;
  let maxCubesHit = 0;
  let life = 10;
  let multi = 24;
  let hasMissed = false;

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


  const gradeDisplay = add([
    pos(22, Math.round(center().y) - 18),
    text('S+', { size: 18 }),
    origin('center'),
    fixed()
  ]);

  gradeDisplay.onUpdate(() => {
    const pGrade = gradeDisplay.text[0];
    const hadPlus = !!gradeDisplay.text[1];
    for(const [grade, minRatio] of Object.entries({
      'S': 0.9,
      'A': 0.8,
      'B': 0.65,
      'C': 0.5,
      'D': -1
    })) {
      if(score / maxScore >= minRatio || maxScore == 0) {
        gradeDisplay.text = grade;
        // Grade changed
        if(grade != pGrade) {
          const scoreWentUp = 'SABCD'.indexOf(grade) < 'SABCD'.indexOf(pGrade);
          const gradeChangeEffect = add([
            pos(gradeDisplay.pos),
            text((scoreWentUp ? grade: pGrade) + (!hasMissed && cubesHit == maxCubesHit ? '+' : ''), { size: 18 }),
            origin('center'),
            opacity(1),
            scale(1),
            fixed()
          ]);
          gradeChangeEffect.onUpdate(() => {
            gradeChangeEffect.scaleTo(gradeChangeEffect.scale.x + (scoreWentUp ? 0.03 : -0.03));
            gradeChangeEffect.opacity -= 0.03;
            if(gradeChangeEffect.opacity <= 0) {
              destroy(gradeChangeEffect);
            }
          });
        }
        
        if(!hasMissed && cubesHit == maxCubesHit) {
          gradeDisplay.text += '+';
        } else if(hadPlus) {
          // Full combo lost
          const fallingPlus = add([
            pos(gradeDisplay.pos.add(6, 0)),
            text('+', { size: 18 }),
            origin('center'),
            move(90, 20),
            rotate(0),
            opacity(1),
            fixed()
          ]);
          fallingPlus.onUpdate(() => {
            fallingPlus.angle += 5;
            fallingPlus.opacity -= 0.03;
            if(fallingPlus.opacity <= 0) {
              destroy(fallingPlus);
            }
          });
        }
        break;
      }
    }
  });

  const scoreDisplay = add([
    pos(22, Math.round(center().y)),
    text('100.00%'),
    origin('center'),
    fixed()
  ]);

  scoreDisplay.onUpdate(() => {
    scoreDisplay.text = (score / maxScore * 100).toFixed(2) + '%';
    if(maxScore == 0) scoreDisplay.text = '100.00%';
  });

  const cubesHitDisplay = add([
    pos(22, Math.round(center().y) + 10),
    text('0/0'),
    origin('center'),
    fixed()
  ]);

  cubesHitDisplay.onUpdate(() => {
    cubesHitDisplay.text = `${cubesHit}/${maxCubesHit}`;
  });


  add([
    pos(width() - 45, Math.round(center().y) - 19),
    text('Life'),
    fixed()
  ]);

  add([
    pos(width() - 45, Math.round(center().y) - 10),
    rect(40, 2),
    color(0, 0, 0),
    opacity(0.6),
    fixed()
  ]);

  const lifeDisplay = add([
    pos(width() - 45, Math.round(center().y) - 10),
    rect(30, 2),
    fixed()
  ]);

  lifeDisplay.onUpdate(() => {
    lifeDisplay.use(rect(life * 4, 2));
  });


  add([
    pos(width() - 45, Math.round(center().y) + 1),
    text('Multi'),
    fixed()
  ]);

  add([
    pos(width() - 45, Math.round(center().y) + 10),
    rect(40, 2),
    color(0, 0, 0),
    opacity(0.6),
    fixed()
  ]);

  const multiDisplay = add([
    pos(width() - 45, Math.round(center().y) + 10),
    rect(30, 2),
    fixed()
  ]);

  multiDisplay.onUpdate(() => {
    multiDisplay.use(rect(multi * 5 / 3, 2));
  });
  
  
  onUpdate('debris', debris => {
    debris.moveBy(debris.vel);
    debris.vel = debris.vel.add(0, 0.1);
    if(debris.pos.y > height()) debris.destroy();
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
      if(!hit) {
        life = Math.max(life - 2, 0);
        multi = Math.max(multi - 6, 0);
        hasMissed = true;
      };
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

  
  // Cubes
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
          splitSprite({
            spriteName: 'debris',
            palette: [palettes['platinum'][0], palettes['platinum'][2], palettes['platinum'][4]],
            dynamic: true
          }),
          'debris'
        ]);
        debris.frame = randi(0, 3);
        debris.vel = Vec2.fromAngle(randi(0, 360));
        debris.each(c => c.use(z(2)));
      }

      life = Math.min(life + 0.5, 10);
      multi = Math.min(multi + 0.5, 24);
  
      const s = Math.round(100 - distance * 6.25); // Min: 0 Max: 100
      score += s * multi;
      cubesHit++;
      cube.destroy();
    });
  }

  onUpdate('cube', cube => {
    cube.frame = cube.baseFrame + constrain(Math.floor((cube.pos.y + 16) / height() * 4), 0, 4);
    
    if(cube.pos.y >= height() + 16) {
      life = Math.max(life - 3, 0);
      multi = Math.max(multi - 12, 0);
      cube.destroy();
    }
    //if(cube.pos.y >= hitline.pos.y - cube.perspective) hitCube(cube, getCubeDistance(cube))
    //if(cube.isColliding(hitline)) hitCube(cube, getCubeDistance(cube))
  });

  on('frame-change', 'cube', cube => {
    // Update offsets
    cube.perspective = [-2, -1, 0, 1, 2][constrain(Math.floor((cube.pos.y + 16) / height() * 4), 0, 4)];
    cube._children.forEach(c => c.use(follow(cube, vec2(0, cube.perspective))));
  });

  on('destroy', 'cube', cube => {
    maxScore += 2400;
    maxCubesHit++;
  });
}


