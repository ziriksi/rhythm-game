import button from '/scripts/button.js';
import roundVector from '/scripts/round-vector.js';
import splitSprite from '/scripts/split-sprite.js';

export default function colorSelect() {
  layers([
    'bg',
    'fg',
    'overlay'
  ], 'fg');
  
  // Background
  add([
    pos(0, 0),
    rect(width(), height()),
    color(93, 133, 203),
    fixed(),
    layer('bg')
  ]);

  // Buttons
  for(let i = 0; i < Object.keys(palettes).length; i++) {
    if(Object.keys(palettes)[i] == 'bronze') break;
    for(let j = 0; j < 4; j++) {
      const thisColor = Object.keys(palettes)[i];
      const newButton = add([
        pos(center().x + j * 20 - 40, i * 23 + 2),
        splitSprite({
          spriteName: 'color-button',
          channels: 3,
          frames: 2,
          palette: palettes[thisColor].slice(1, 4)
        }),
        area(),
        button(),
        'color-button'
      ]);
      newButton.colorName = Object.keys(palettes)[i];
      newButton.tier = j;
      newButton.gridX = j;
      newButton.gridY = i;
      newButton.hoverText = `${['Dulled ', '', 'Shiny ', 'Radiant '][j]}${thisColor.replace(/(?<=\W|^)[a-z]/gi, l => l.toUpperCase()).replace(/-/g, ' ')}\nUnlock by passing <map> on ${['Easy', 'Medium', 'Hard', 'Albanian'][j]} difficulty or higher`;

      newButton.lock = add([
        pos(center().x + j * 20 - 36, i * 23 + 4),
        sprite('lock')
      ]);
      newButton.accent = add([
        pos(newButton.pos.add(11, -3)),
        sprite('color-button-accents', { frame: newButton.tier })
      ]);
    }
  }

  // Add bronze - platinum
  for(let i = 0; i < 4; i++) {
    const newButton = add([
      pos(center().x + i * 20 - 40, 279),
      splitSprite({
        spriteName: 'color-button',
        channels: 3,
        frames: 2,
        palette: palettes[['bronze', 'silver', 'gold', 'platinum'][i]].slice(1, 4)
      }),
      area(),
      button(),
      'color-button'
    ]);
    newButton.colorName = ['bronze', 'silver', 'gold', 'platinum'][i];
    newButton.tier = 3;
    newButton.gridX = i
    newButton.gridY = 12;
    newButton.hoverText = `${['bronze', 'silver', 'gold', 'platinum'][i].replace(/(?<=\W|^)[a-z]/gi, l => l.toUpperCase())}\nUnlock by clearing all maps on ${['Easy', 'Medium', 'Hard', 'Albanian'][i]} difficulty or higher (any mode)`;
    
    newButton.lock = add([
      pos(newButton.pos.add(4, 3)),
      sprite('lock')
    ]);

    newButton.accent = add([
      pos(newButton.pos.add(11, -3)),
      sprite('color-button-accents', { frame: newButton.tier })
    ]);
  }

  onClick('color-button', b => {
    alert(b.colorName + ' ' + b.tier);
  });
  

  // Hover info
  const hoverBox = add([
    pos(0, 0),
    rect(55, 30),
    color(20, 20, 40),
    fixed(),
    opacity(0)
  ]);
  hoverBox.onUpdate(function() {
    this.pos = mousePos();
    if(this.pos.x > width() - 55) this.pos.x = width() - 55;
    if(this.pos.y > height() - 30) this.pos.y = height() - 30;

    this.use(opacity(0));
    hoverText.use(opacity(0));
    every('color-button', c => {
      if(c.isHovering()) {
        this.use(opacity(0.9));
        hoverText.use(opacity(1));
        hoverText.text = c.hoverText;
        return;
      }
    });
  });
  const hoverText = add([
    pos(2, 2),
    text('Sample Text', {
      font: 'sink',
      size: 4,
      width: 55
    }),
    opacity(0),
    fixed(),
    follow(hoverBox, vec2(2, 2))
  ]);

  
  onKeyDown('w', () => {
    camPos(camPos().add(vec2(0, -2)));
    if(camPos().y < height() / 2) camPos(camPos().x, height() / 2);
  });
  onKeyDown('s', () => {
    camPos(camPos().add(vec2(0, 2)));
    if(camPos().y > 298 - height() / 2) camPos(camPos().x, 298 - height() / 2);
  });
}
