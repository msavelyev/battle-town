import { DirectionType } from './DirectionType.js';

const DATA = Object.freeze({
  UP: {
    value: 'UP',
    type: DirectionType.VERTICAL,
    angle: 0,
    dx: 0,
    dy: -1,
    next: 'RIGHT',
  },
  DOWN: {
    value: 'DOWN',
    type: DirectionType.VERTICAL,
    angle: 180,
    dx: 0,
    dy: 1,
    next: 'LEFT',
  },
  LEFT: {
    value: 'LEFT',
    type: DirectionType.HORIZONTAL,
    angle: 270,
    dx: -1,
    dy: 0,
    next: 'UP',
  },
  RIGHT: {
    value: 'RIGHT',
    type: DirectionType.HORIZONTAL,
    angle: 90,
    dx: 1,
    dy: 0,
    next: 'DOWN',
  }
});

export const Direction = Object.freeze({
  UP: 'UP',
  DOWN: 'DOWN',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
});

export function dx(direction) {
  return DATA[direction].dx;
}

export function dy(direction) {
  return DATA[direction].dy;
}

function angle(direction) {
  return DATA[direction].angle;
}

export function toRad(direction) {
  return degToRad(angle(direction));
}

export function type(direction) {
  return DATA[direction].type;
}

export function next(direction) {
  return DATA[direction].next;
}

export function degToRad(deg) {
  return deg * Math.PI / 180;
}
