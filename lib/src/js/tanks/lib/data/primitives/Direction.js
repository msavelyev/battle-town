const {freeze} = require('@Lib/tanks/lib/util/immutable.js');
const {DirectionType} = require('@Lib/tanks/lib/data/primitives/DirectionType.js');

const DATA = freeze({
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

/**
 *
 * @name Direction
 * @enum {string}
 */
const Direction = freeze({
  UP: 'UP',
  DOWN: 'DOWN',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
});
module.exports.Direction = Direction;

function dx(direction) {
  return DATA[direction].dx;
}
module.exports.dx = dx;

function dy(direction) {
  return DATA[direction].dy;
}
module.exports.dy = dy;

function angle(direction) {
  return DATA[direction].angle;
}

function toRad(direction) {
  return degToRad(angle(direction));
}
module.exports.toRad = toRad;

function type(direction) {
  return DATA[direction].type;
}
module.exports.type = type;

function next(direction) {
  return DATA[direction].next;
}
module.exports.next = next;

function degToRad(deg) {
  return deg * Math.PI / 180;
}
module.exports.degToRad = degToRad;
