// Keep line below
const eventProxy = add(['event-proxy']);
const event = (id, callback) => eventProxy.trigger(id, 'event-proxy', callback);

class Visualizer { 
  constructor(side, y) {
    for(let i = 0; i < 10; i++) {
      this.boxes.push(add([
        pos({ 
          left: i * 5,
          right: width() - i * 5 - 4
        }[side], y * 9 + 1),
        rect(4, 8),
        color(160, 88, 105),
        move(90, 10),
        layer('bg'),
        fixed(),
        'visualizer-box'
      ]));
    }
  }
  
  visible = randi(10);
  boxes = [];
  
  update() {
    this.visible = Math.max(0, this.visible - 1);
    for(let i = 0; i < this.boxes.length; i++) {
      this.boxes[i].use(opacity(this.visible > i ? 1 : 0));
    }
  }

  beat() {
    this.visible = Math.min(this.visible + rand(0, 10 - this.visible), 10);
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


add([
  pos(0, 0),
  rect(width(), height()),
  color(218, 112, 112),
  layer('bg'),
  fixed()
]);

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
  if(isKeyPressed()) {
    for(let i = 0; i < visualizers.length; i++) {
      visualizers[i].beat();
    }
  }
});


event('alert', text => {
  alert(text);
});