import Direction from './Direction.js';
import { Point } from '../protobuf/Data.js';

Point.n = function(x, y) {
  return Point.create({ x, y });
};

Point.round = function(point) {
  return Point.n(Math.round(point.x), Math.round(point.y));
};

Point.move = function(point, direction, by) {
  return Point.n(point.x + by * Direction.dx(direction), point.y + by * Direction.dy(direction));
};

export default Point;
