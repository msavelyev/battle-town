import Point from './Point.js';
import Direction from './Direction.js';

export default class TankMove {

  constructor(id, direction, position) {
    this.id = id;
    this.direction = direction;
    this.position = position;
  }

  static create(data) {
    return new TankMove(
      data.id,
      data.direction instanceof Direction ? data.direction : Direction.create(data.direction),
      data.position ? Point.create(data.position) : null
    );
  }

}
