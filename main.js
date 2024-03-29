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
window.splits = {};

// Setup
kaboom({
  fullscreen: true,
  crisp: true,
  background: [0, 0, 0],
  scale: 10,
  font: 'cp437',
  debug: true
});

loadFont('cp437', 'assets/cp437.png', 6, 9, { chars: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.:,;(*!?}^)#${%^&-+/'})

const _loadSprite = loadSprite;

loadSprite = (id, src, options) => {
  options = options ?? {};
  _loadSprite(id, src, options);
  window.splits[id] = {
    x: options.sliceX || 1,
    y: options.sliceY || 1
  }
};


// Load sprites
loadRoot('/img/');
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
loadSprite('trigger-map-button', 'editor-buttons/trigger-map-button.png', { sliceX: 2 });
loadSprite('arrow', 'editor-buttons/arrow.png', { sliceX: 2 });
loadSprite('small-white-button', 'editor-buttons/small-button.png', { sliceX: 2 });

loadSprite('cube', 'cube.png', { sliceX: 30, sliceY: 4 });
loadSprite('cube-hitline', 'cube-hitline.png', { sliceY: 5 });
loadSprite('debris', 'debris.png', { sliceX: 3, sliceY: 3 });


// Audio
loadRoot('/audio/music/');
loadSound('100bpm', '100bpm.mp3');


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
