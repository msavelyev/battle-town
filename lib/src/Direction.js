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
    return new Direction(DATA.UP.value);
  }

  static get DOWN() {
    return new Direction(DATA.DOWN.value);
  }

  static get LEFT() {
    return new Direction(DATA.LEFT.value);
  }

  static get RIGHT() {
    return new Direction(DATA.RIGHT.value);
  }

  constructor(value) {
    if (!DATA[value]) {
      throw Error('Unknown direction: ' + value);
    }
    this.value = value;
    this.angle = DATA[value].angle;
    this.type = DATA[value].type;
    this.dx = DATA[value].dx;
    this.dy = DATA[value].dy;
  }

  toJSON() {
    return this.value;
  }

  eq(other) {
    return other !== null && this.value === other.value;
  }

  static create(data) {
    if (data) {
      return new Direction(data);
    } else {
      return null;
    }
  }

};
