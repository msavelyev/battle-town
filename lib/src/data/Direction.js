import Data from '../protobuf/Data.js';

const Direction = Data.Direction;

const DATA = Object.freeze({
  [Direction.UP]: {
    angle: 0,
    dx: 0,
    dy: -1
  },
  [Direction.DOWN]: {
    angle: 180,
    dx: 0,
    dy: 1
  },
  [Direction.LEFT]: {
    angle: 270,
    dx: -1,
    dy: 0
  },
  [Direction.RIGHT]: {
    angle: 90,
    dx: 1,
    dy: 0
  }
});

Direction.dx = function(direction) {
  return DATA[direction].dx;
};

Direction.dy = function(direction) {
  return DATA[direction].dy;
};

Direction.angle = function(direction) {
  return DATA[direction].angle;
};

export default Direction;
