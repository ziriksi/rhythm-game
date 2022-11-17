// 'bg' must be defined as a layer before using

export default function menuBackground() {
  const visualizers = [];
  let loopDistance = -9;
  for(let i = 0; i < height() / 9 + 2; i++) {
    visualizers.push(new LeftVisualizer(i));
    visualizers.push(new RightVisualizer(i));
    loopDistance += 9;
  }
  onUpdate('visualizer-box', box => {
    if(box.pos.y > height()) {
      box.moveBy(0, -loopDistance);
    }
  });

  let frame = 0;
  onUpdate(() => {
    frame++;
    if(frame % 5 == 0) {
      for(let i = 0; i < visualizers.length; i++) {
        visualizers[i].update();
      }
    }
    if(frame % 30 == 0) {
      for(let i = 0; i < visualizers.length; i++) {
        visualizers[i].beat();
      }
    }
  });
}

class Visualizer {
  constructor(side, y) {
    for(let i = 0; i < 10; i++) {
      this.boxes.push(add([
        pos({ 
          left: i * 5,
          right: width() - i * 5 - 4
        }[side], y * 9 + 1),
        rect(4, 8),
        color(218, 112, 112),
        move(90, 10),
        layer('bg'),
        'visualizer-box'
      ]));
    }
  }
  
  visible = 10;
  boxes = [];
  
  update() {
    this.visible = Math.max(0, this.visible - 1);
    for(let i = 0; i < this.boxes.length; i++) {
      this.boxes[i].use(opacity(this.visible > i ? 1 : 0));
    }
  }

  beat() {
    this.visible = Math.min(this.visible + rand(0, 12 - this.visible), 10);
  }
}

class LeftVisualizer extends Visualizer {
  constructor(y) {
    super('left', y);
  }
}

class RightVisualizer extends Visualizer {
  constructor(y) {
    super('right', y);
  }
}