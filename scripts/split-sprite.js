import hexToRgb from './hex-to-rgb.js';

// Creates a sprite component from an image split by color channels
export default function splitSprite({ spriteName, channels, frames, palette, frame, dynamic }) {
  return {
    id: 'split-sprite',
    
    add() {
      this.lastFrame = -1;
      this.use(sprite(spriteName));
      this.use(opacity(0));
      this.frame = frame || 0;
      
      this._children = [];
      for(let i = 0; i < channels; i++) {
        const child = add([
          pos(this.pos),
          sprite(spriteName, { frame: frames * i }),
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
        this._children.forEach(c => fn(c));
      };

      this.warningEvent = this.on('destroy', () => debug.log("Use this.destroy() instead"));

      this.destroy = () => {
        this.warningEvent(); // Cancel event
        this._children.forEach(c => destroy(c));
        destroy(this);
      };
    }
  }
}