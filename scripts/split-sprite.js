import hexToRgb from './hex-to-rgb.js';

// Creates a sprite component from an image split by color channels
export default function splitSprite(spriteName, rows, columns, palette) {
  return {
    id: 'split-sprite',
    
    add() {
      this.rows = rows;
      this.columns = columns;
      this.use(sprite(spriteName));
      this.use(opacity(0));
      
      this._children = [];
      for(let i = 0; i < rows; i++) {
        this._children.push(add([
          pos(this.pos),
          sprite(spriteName, { frame: columns * i }),
          hexToRgb(palette[i])
        ]));
      }
    }
  }
}