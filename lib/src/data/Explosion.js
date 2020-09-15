import {v4 as uuid} from 'uuid';
import Entity from './Entity.js';
import EntityType from './EntityType.js';
import {FPS} from '../Ticker.js';
import Point from './Point.js';
import Bullet from './Bullet.js';

export default class Explosion extends Entity {

  constructor(id, position, tick) {
    super(id, EntityType.EXPLOSION, position, 2);

    this.tick = tick;
  }

  static fromBullet(bullet, tick) {
    const position = new Point(
      bullet.position.x - Bullet.size() / 2,
      bullet.position.y - Bullet.size() / 2
    );

    return new Explosion(
      uuid(),
      position,
      tick
    );
  }

  static get LIFETIME_TICKS() {
    return FPS;
  }

}
