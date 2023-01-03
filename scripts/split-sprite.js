import hexToRgb from './hex-to-rgb.js';

// Creates a sprite component from an image split by color channels
export default function splitSprite({ spriteName, palette, frame, dynamic }) {
  return {
    id: 'split-sprite',
    
    add() {
      this.lastFrame = -1;
      this.use(sprite(spriteName));
      this.use(opacity(0));
      this.frame = frame || 0;
      
      this._children = [];
      for(let i = 0; i < window.splits[spriteName].y; i++) {
        const child = add([
          pos(this.pos),
          sprite(spriteName, { frame: window.splits[spriteName].x * i }),
          hexToRgb(palette[i]),
          dynamic ? follow(this) : null
        ]);
        child.baseFrame = child.frame;
        
        this._children.push(child);
      }
      
      this.onUpdate(() => {
        if(this.lastFrame != this.frame) {
          this._children.forEach(c => {
            c.frame = c.baseFrame + this.frame;
          });
          this.trigger('frame-change');
        }
        this.lastFrame = this.frame;
      });

      this.each = fn => {
        this._children.forEach(fn);
      };

      this.warningEvent = this.on('destroy', () => debug.log('Use this.destroy() instead'));

      this.destroy = () => {
        this.warningEvent(); // Cancel event
        this.each(c => destroy(c));
        destroy(this);
      };
    }
  }
}