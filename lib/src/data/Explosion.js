import {v4 as uuid} from 'uuid';
import Direction from './Direction.js';
import DirectionType from './DirectionType.js';
import Entity from './Entity.js';
import EntityType from './EntityType.js';
import {FPS} from '../Ticker.js';
import Point from './Point.js';
import Bullet from './Bullet.js';

function calcPosition(bullet) {
  const directionType = Direction.type(bullet.direction);
  switch (directionType) {
    case DirectionType.HORIZONTAL:
      return new Point(bullet.position.x + Bullet.size() / 4 - Bullet.size(), bullet.position.y);
    case DirectionType.VERTICAL:
      return new Point(bullet.position.x, bullet.position.y + Bullet.size() / 4 - Bullet.size());
    default:
      throw new Error('Unknown direction type ' + directionType);
  }
}

export default class Explosion extends Entity {

  constructor(id, position, tick) {
    super(id, EntityType.EXPLOSION, position, 2);

    this.tick = tick;
  }

  static fromBullet(bullet, tick) {
    return new Explosion(
      uuid(),
      calcPosition(bullet),
      tick
    );
  }

  static get LIFETIME_TICKS() {
    return FPS;
  }

}
