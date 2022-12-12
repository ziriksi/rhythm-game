import button from '/scripts/button.js';
import transition from '/scripts/transition.js';
import background from '/scripts/background.js';

export default function title() {
  layers([
    'bg',
    'fg',
    'overlay'
  ], 'fg');

  load(background('/backgrounds/menu.js'));
  
  const playButton = add([
    pos(center().scale(1, 1 / 2)),
    sprite('wide-placeholder'),
    origin('center'),
    area(),
    button(),
    color(255, 255, 255)
  ]);
  playButton.onClick(() => {
    go('level-select');
  });


  for(let i = 0; i < 4; i++) {
    add([
      pos(center().scale(1 / 4 + i / 2, 3 / 2)),
      sprite('aux-buttons', { frame: i * 2 }),
      origin('center'),
      area(),
      button()
    ]).onClick(() => {
      transition(['color-select', 'settings', 'map-editor', 'browser'][i], '/backgrounds/menu.js');
    });
  }

  onUpdate(() => {
    
  });
};