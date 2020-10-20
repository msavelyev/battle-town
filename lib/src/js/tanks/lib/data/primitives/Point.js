import {freeze} from '@Lib/tanks/lib/util/immutable.js';
import * as Direction from '@Lib/tanks/lib/data/primitives/Direction.js';

const ROUND_ERROR = 10000;

/**
 * @typedef {Object} Point
 * @property {number} x
 * @property {number} y
 */

const Point = {
  /**
   *
   * @param {number} x
   * @param {number} y
   * @return {Point}
   */
  create(x, y) {
    return freeze({
      x: Math.round(x * ROUND_ERROR) / ROUND_ERROR,
      y: Math.round(y * ROUND_ERROR) / ROUND_ERROR
    });
  },

  round(point) {
    return Point.create(Math.round(point.x), Math.round(point.y));
  },

  move(point, direction, by) {
    return Point.create(point.x + by * Direction.dx(direction), point.y + by * Direction.dy(direction));
  },

  within(point, tl, br) {
    return tl.x <= point.x && tl.y <= point.y && br.x >= point.x && br.y >= point.y;
  },

  eq(a, b) {
    if (a === b) {
      return true;
    }

    if (a === null || b === null) {
      return false;
    }

    return a.x === b.x && a.y === b.y;
  },

  diff(a, b) {
    return Point.create(b.x - a.x, b.y - a.y);
  }

};

export default Point;
