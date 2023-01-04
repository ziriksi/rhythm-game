import button from '/scripts/button.js';
import constrain from '/scripts/constrain.js';

export default function mapEditor() {
  camPos(camPos().add(0, 16));
  let bpm = 60;
  let speed = 50;
  const floor = center().y + 16;
  let map = [];
  let laneCount = 4;
  
  // Background
  add([
    pos(0, 0),
    rect(width(), height()),
    color(0, 0, 0),
    fixed()
  ]);

  // Lane settings
  const laneDisplay = add([
    pos(width() + 20, 20),
    text('Lanes\n  4', { size: 9 }),
    'followY'
  ]);
  
  const lanesDown = add([
    pos(vec2(width() + 21, 28)),
    sprite('arrow'),
    area(),
    'followY',
    button()
  ]);
  
  lanesDown.onClick(() => {
    laneCount = Math.max(laneCount - 2, 2);
    laneDisplay.text = `Lanes\n  ${laneCount}`;
    
    // Update tiles
    every('tile', t => {
      t.use(color(64, 64, 64));
      if((t.mapX > 2 - laneCount / 2 && t.mapX < 3 + laneCount / 2) || t.mapX == 6) {
        t.use(color(255, 255, 255));
      }
    });
  });
  
  const lanesUp = add([
    pos(vec2(width() + 41, 28)),
    sprite('arrow', { flipX: true }),
    area(),
    'followY',
    button()
  ]);
  
  lanesUp.onClick(() => {
    laneCount = Math.min(laneCount + 2, 6);
    laneDisplay.text = `Lanes\n  ${laneCount}`;
    
    // Update tiles
    every('tile', t => {
      t.use(color(64, 64, 64));
      if((t.mapX > 2 - laneCount / 2 && t.mapX < 3 + laneCount / 2) || t.mapX == 6) {
        t.use(color(255, 255, 255));
      }
    });
  });
  

  // BPM settings
  const bpmDisplay = add([
    pos(width() + 20, 40),
    text('BPM: 60', { size: 9 }),
    'followY'
  ]);
  const bpmButton = add([
    pos(width() + 74, 40),
    sprite('small-white-button'),
    area(),
    'followY',
    button()
  ]);
  bpmButton.onClick(() => {
    bpm = constrain(prompt('BPM:'), 0, 9999) || 60;
    bpmDisplay.text = `BPM: ${bpm}`;
  });

  // Speed settings
  const speedDisplay = add([
    pos(width() + 20, 50),
    text('Speed: 50 px/s', { size: 9 }),
    'followY'
  ]);
  
  const speedButton = add([
    pos(width() + 110, 50),
    sprite('small-white-button'),
    area(),
    'followY',
    button()
  ]);
  speedButton.onClick(() => {
    speed = Math.round(constrain(prompt('Speed:'), 1, 500)) || 50;
    speedDisplay.text = `Speed: ${speed} px/s`;
  });

  // Playhead
  const playHead = add([
    pos(0, height()),
    rect(width(), 2),
    z(1)
  ]);

  playHead.hidden = true

  playHead.onUpdate(function() {
    if(!this.hidden) camPos(camPos().x, Math.min(this.pos.y, floor));
  });

  // Playtest
  const playTest = add([
    pos(152, 80),
    sprite('arrow', { flipX: true }),
    area(),
    origin('center'),
    button(),
    'followY'
  ]);

  playTest.onClick(() => {
    playHead.moveTo(playHead.pos.x, Math.round(camPos().y + height() / 2) - 16);
    playHead.use(move(270, bpm * 64 /  60));
    playHead.hidden = false;
    camPos(camPos().x, Math.min(playHead.pos.y, floor));
  });

  // Stop playtest
  const stopPlayTest = add([
    pos(152, 90),
    sprite('small-white-button'),
    area(),
    origin('center'),
    button(),
    'followY'
  ]);

  stopPlayTest.onClick(() => {
    playHead.hidden = true;
  });
  

  // Slider scroll
  const slider = add([
    pos(150, 20),
    rect(4, 50),
    color(128, 128, 128),
    'followY'
  ]);
  
  const sliderHead = add([
    pos(152, 70),
    rect(6, 2),
    color(255, 255, 255),
    area(),
    origin('center'),
    'followY'
  ]);
  sliderHead.dragging = false;
  sliderHead.onUpdate(function() {
    this.use((this.isHovering() || this.dragging) ? rect(8, 4) : rect(6, 2));
    if(this.dragging && isMouseMoved()) {
      this.moveBy(0, mouseDeltaPos().y);
      this.offset = constrain(this.offset, slider.offset, slider.offset + 50);
      sync.sliderToCam();
    };
  });
  sliderHead.onClick(() => {
    sliderHead.dragging = true;
  });

  const sync = {
    sliderToCam: () => {
      const cameraBounds = {
        min: floor,
        max: Math.min(-map.length * 16 + 116, floor)
      };
      
      camPos(camPos().x, lerp(cameraBounds.min, cameraBounds.max, 1 - (sliderHead.pos.y - slider.pos.y) / 50));
    },
    camToSlider: () => {
      if(map.length < 4) return 0; // Failsafe
      const cameraBounds = {
        min: floor,
        max: Math.min(-map.length * 16 + 116, floor)
      };
      // Camera pos in a range from 0 to 1
      // Anything outside the range gets clamped
      // PICK A BETTER VARIABLE NAME
      const c = constrain((camPos().y - floor) / (cameraBounds.max - cameraBounds.min), 0, 1);
      sliderHead.offset = slider.offset + 50 - c * 50;
    }
  };
  


  every('followY', o => {
    o.offset = o.pos.y - camPos().y;
    o.moveBy = function(x, y) {
      this.offset += y;
    }
  });
  onUpdate('followY', o => {
    o.pos.y = camPos().y + o.offset;
  });


  // Tiles
  // Yk the grid of buttons for editing the map
  // Idk why I used the term tiles instead of buttonGrid or something but they are tiled I guess
  let tilesHeight = 0; // Num of pixels to wrap
  const lowestY = Math.round(height()); // Used as a reference point for measuring the Y value

  for(let y = height(); y > -32; y -= 16) {
    tilesHeight += 16;
    for(let x = 0; x < 112; x += 16) {
      add([
        pos(vec2(x + 32, y)),
        sprite('off-map-button'),
        area(),
        'tile',
        button()
      ]);
    }
  }
  
  every('tile', t => {
    t.mapX = (t.pos.x - 32) / 16;
    t.mapY = null;
    t.active = false;
    t.updateY = function() {
      this.mapY = (lowestY - this.pos.y) / 16;
      this.active = !!map?.[this.mapY]?.[this.mapX];
      this.use(sprite((this.active ? 'on' : 'off') + '-map-button'));
    };
    t.updateY();
    
    // Update tints
    every('tile', t => {
      t.use(color(64, 64, 64));
      if((t.mapX > 2 - laneCount / 2 && t.mapX < 3 + laneCount / 2) || t.mapX == 6) {
        t.use(color(255, 255, 255));
      }
    });
  });
  onClick('tile', t => {
    t.active = !t.active; // Swap
    t.use(sprite((t.active ? 'on' : 'off') + '-map-button'));

    // Fill missing rows
    while(map.length < t.mapY + 1) {
      map.push([0, 0, 0, 0, 0, 0, 0, 0]);
    }

    map[t.mapY][t.mapX] = +t.active;
    
    // Remove empty rows at the top
    while(map?.[map.length - 1]?.every(x => x == 0)) {
      map.pop();
    }
  });
  onUpdate('tile', t => {
    // Wrap around
    while(t.pos.y < camPos().y - height() / 2) {
      t.pos.y += tilesHeight;
      t.updateY();
    }
    while(t.pos.y > camPos().y + height() / 2 + 16) {
      t.pos.y -= tilesHeight;
      t.updateY();
    }
  });

  
  
  // Scroll
  let scrollSpeed = 3;
  onKeyDown('w', () => {
    camPos(camPos().add(0, -scrollSpeed));
    scrollSpeed += 0.1;
  });
  onKeyDown('s', () => {
    camPos(camPos().add(0, scrollSpeed));
    scrollSpeed += 0.1;
    
    camPos(vec2(camPos().x, Math.min(camPos().y, floor)));
  });

  // Change screens
  onKeyPress('d', () => {
    if(camPos().x == width() / 2) {
      const targetX = width() * 3 / 2;
      let i = 0;
      let interval = setInterval(() => {
        i += 5;
        if(i == 180) {
          camPos(targetX, camPos().y);
          clearInterval(interval);
          return;
        }
        camPos(width() / 2 + (targetX - width() / 2) * (1 - Math.cos(deg2rad(i))) / 2, camPos().y);
      }, 10);
    }
  });

  // Terms are inaccurate here, I just copypasted from above and switched values around, 'targetX' is actually the initial position
  onKeyPress('a', () => {
    if(camPos().x == width() * 3 / 2) {
      const targetX = width() * 3 / 2;
      let i = 180;
      let interval = setInterval(() => {
        i -= 5;
        if(i == 0) {
          camPos(width() / 2, camPos().y);
          clearInterval(interval);
          return;
        }
        camPos(width() / 2 + (targetX - width() / 2) * (1 - Math.cos(deg2rad(i))) / 2, camPos().y);
      }, 10);
    }
  });

  onMouseRelease(() => {
    sliderHead.dragging = false;
  });


  
  onUpdate(() => {
    if(!isKeyDown('w') && !isKeyDown('s')) {
      scrollSpeed = 3;
    }
    if(!isMouseDown()) sync.camToSlider();
  });


  
  onDraw(() => {
    const start = Math.floor((height() / 2 - camPos().y) / 16)
    for(let y = start; y < start + 10; y++) {
      if((y + 2) % 4 == 0) {
        drawText({ text: (y - 2) / 4 + 1, size: 9, width: 32, pos: vec2(2, height() - 16 * (y + 1) + 3), color: WHITE });
      } else {
        drawRect({ width: 30, height: 2, pos: vec2(1, height() - 16 * (y + 1) + 7), color: WHITE, opacity: 0.65 });
      }
    }
  });
};