import roundVector from './round-vector.js';

export default function button() {
  return {
    id: 'button',
    add() {
      this.defaultFrame = this.frame;
      this.pos = roundVector(this.pos);
    },
    update() {
      this.frame = this.defaultFrame + (+this.isHovering());
    }
  }
}