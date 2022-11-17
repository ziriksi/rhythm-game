import roundVector from './round-vector.js';

export default function button() {
  return {
    id: 'button',
    add() {
      this.defaultFrame = this.frame;
      this.pos = roundVector(this.pos);
    },
    update() {
      if(this.hasOwnProperty('_children')) {
        for(let i = 0; i < this._children.length; i++) {
          this._children[i].frame = this.defaultFrame + (+this.isHovering()) + i * 2;
        }
      } else {
        this.frame = this.defaultFrame + (+this.isHovering());
      }
    }
  }
}