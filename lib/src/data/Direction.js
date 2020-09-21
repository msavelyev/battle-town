import DirectionType from './DirectionType.js';

const DATA = Object.freeze({
  UP: {
    value: 'UP',
    type: DirectionType.VERTICAL,
    angle: 0,
    dx: 0,
    dy: -1
  },
  DOWN: {
    value: 'DOWN',
    type: DirectionType.VERTICAL,
    angle: 180,
    dx: 0,
    dy: 1
  },
  LEFT: {
    value: 'LEFT',
    type: DirectionType.HORIZONTAL,
    angle: 270,
    dx: -1,
    dy: 0
  },
  RIGHT: {
    value: 'RIGHT',
    type: DirectionType.HORIZONTAL,
    angle: 90,
    dx: 1,
    dy: 0
  }
});

export default class Direction {

  static get UP() {
    return 'UP';
  }

  static get DOWN() {
    return 'DOWN';
  }

  static get LEFT() {
    return 'LEFT';
  }

  static get RIGHT() {
    return 'RIGHT';
  }

  static dx(direction) {
    return DATA[direction].dx;
  }

  static dy(direction) {
    return DATA[direction].dy;
  }

  static angle(direction) {
    return DATA[direction].angle;
  }

  static toRad(direction) {
    return degToRad(Direction.angle(direction));
  }

  static type(direction) {
    return DATA[direction].type;
  }

};

export function degToRad(deg) {
  return deg * Math.PI / 180;
}
