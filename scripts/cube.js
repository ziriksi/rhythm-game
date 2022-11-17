import constrain from './constrain.js';
import hexToRgb from './hex-to-rgb.js';

// UPDATE THIS MESS TO USE SPLITSPRITE

export default class Cube {
  constructor(lane, palette) {
    this.palette = palettes[palette];

    // Parent GameObj is invisible and handles locating and whatnot
    this.parent = add([
      pos(Math.round(width() / 2) + lane * 16 - 48, -16),
      rect(16, 16),
      opacity(0),
      area()
    ]);

    
    this.parent.onUpdate(() => {
      const quadrant = constrain(Math.floor((this.parent.pos.y + 16) / height() * 4), 0, 4);
      if(this.parent.pos.y >= height()) {
        destroy(this.parent);
        this.children.forEach(c => destroy(c));
      }

      // Update frames and offsets
      for(const i of this.children) {
        if(i.frame != i.baseFrame + quadrant * 6) {
          i.frame = i.baseFrame + quadrant * 6;
          let offset = vec2(0, quadrant - 2);
          i.use(follow(this.parent, offset));
        }
      }

      this.parent.move(0, 50);
    });

    // Holds each color channel indiviudally
    // Each will follow the parent GameObj
    this.children = [];
    for(let i = 0; i < 4; i++) {
      this.children.push(add([
        pos(0, 0),
        follow(this.parent, vec2(0, -2)),
        sprite('cubes'),
        hexToRgb(this.palette[i + 1])
      ]));
      this.children[i].layer = i;
      this.children[i].frame = lane + i * 30;
      this.children[i].baseFrame = lane + i * 30;
    }
  }
}
