import kaboom from './lib/kaboom.mjs';

import title from './scenes/title.js';
import levelSelect from './scenes/level-select.js';
import colorSelect from './scenes/color-select.js';
import settings from './scenes/settings.js';
import mapEditor from './scenes/map-editor.js';
import browser from './scenes/browser.js';

import playClassic from './scenes/play-classic.js';
import playClick from './scenes/play-click.js';
import playCut from './scenes/play-cut.js';

import loadJSON from './scripts/load-json.js';

// Global
window.palettes = await loadJSON('./assets/palettes.json');
window.save = {};

// Setup
kaboom({
  fullscreen: true,
  crisp: true,
  scale: 10,
  debug: true
});

loadFont('cp437', 'assets/cp437.png', 6, 9, { chars: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.:,;(*!?}^)#${%^&-+'})


// Load sprites
loadRoot('./img/');
loadSprite('placeholder', 'placeholder.png', { sliceX: 2 });
loadSprite('wide-placeholder', 'wide-placeholder.png', { sliceX: 2 });

loadSprite('aux-buttons', 'aux-buttons.png', { sliceX: 2 , sliceY: 4 });
loadSprite('small-button', 'small-button.png', { sliceX: 4 });

loadSprite('color-button', 'color-button.png', { sliceX: 2, sliceY: 3 });
loadSprite('color-button-accents', 'color-button-accents.png', { sliceX: 4 });
loadSprite('lock', 'lock.png');

loadSprite('keyboard-settings', 'keyboard-settings.png', { sliceY: 6 });

loadSprite('off-map-button', 'editor-buttons/off-map-button.png', { sliceX: 2 });
loadSprite('on-map-button', 'editor-buttons/on-map-button.png', { sliceX: 2 });
loadSprite('arrow', 'editor-buttons/arrow.png', { sliceX: 2 });
loadSprite('small-white-button', 'editor-buttons/small-button.png', { sliceX: 2 });

loadSprite('cube', 'cube.png', { sliceX: 30, sliceY: 4 });
loadSprite('cube-hitline', 'cube-hitline.png', { sliceY: 5 });


// Scenes
scene('title', title);
scene('level-select', levelSelect);
scene('color-select', colorSelect);
scene('settings', settings);
scene('map-editor', mapEditor)
scene('browser', browser);

scene('play-classic', playClassic);
scene('play-click', playClick);
scene('play-cut', playCut);


// Start
go('title');
