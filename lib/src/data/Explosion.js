import Entity from './Entity.js';
import EntityType from './EntityType.js';
import {FPS} from '../Ticker.js';
import Point from './Point.js';
import Bullet from './Bullet.js';

import { Explosion } from '../protobuf/Data.js';

Explosion.n = function(id, position, tick) {
  const entity = Entity.n(id, EntityType.EXPLOSION, position, 2);
  return Explosion.create({ entity, tick })
};

Explosion.fromBullet = function(bullet, tick) {
  const position = Point.n(
    bullet.entity.position.x - Bullet.SIZE / 2,
    bullet.entity.position.y - Bullet.SIZE / 2
  );

  return Explosion.n(
    bullet.entity.id,
    position,
    tick
  );
}

Explosion.LIFETIME_TICKS = FPS;

export default Explosion;
