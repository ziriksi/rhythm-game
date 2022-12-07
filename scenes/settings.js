import menuBackground from '/scripts/menu-background.js';
import button from '/scripts/button.js'

export default function settings() {
  layers([
    'bg',
    'fg',
    'overlay'
  ], 'fg');
  
  menuBackground();

  const keyboard = add([
    pos(center().x, 16),
    sprite('keyboard-settings'),
    origin('center')
  ]);
  keyboard.setting = 0;
  keyboard.press = false;

  const changeKeys = add([
    pos(center().x - 40, 32),
    area(),
    sprite('small-button'),
    origin('center'),
    button()
  ]);
  changeKeys.onClick(() => {
    keyboard.setting++;
    keyboard.setting %= 3;
    keyboard.frame = keyboard.setting * 2 + keyboard.press;
  });

  add([
    pos(center().x, 32),
    text('Change keys', {
      text: 'Change keys',
      font: 'cp437'
    }),
    origin('center')
  ])

  let frame = 0;

  onUpdate(() => {
    frame++;

    if(frame % 15 == 0) {
      keyboard.press = !keyboard.press;
      keyboard.frame = keyboard.setting * 2 + keyboard.press;
    }
  });
}