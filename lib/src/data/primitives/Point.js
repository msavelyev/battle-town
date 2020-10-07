import * as Direction from './Direction.js';

export function create(x, y) {
  return { x, y };
}

export function round(point) {
  return create(Math.round(point.x), Math.round(point.y));
}

export function move(point, direction, by) {
  return create(point.x + by * Direction.dx(direction), point.y + by * Direction.dy(direction));
}

export function within(point, tl, br) {
  return tl.x <= point.x && tl.y <= point.y && br.x >= point.x && br.y >= point.y;
}

export function eq(a, b) {
  if (a === b) {
    return true;
  }

  if (a === null || b === null) {
    return false;
  }

  return a.x === b.x && a.y === b.y;
}
