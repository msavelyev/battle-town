import Point from './Point.js';
import Entity from './Entity.js';
import EntityType from './EntityType.js';

import { Bullet } from '../protobuf/Data.js';

Bullet.SIZE = 1;

Bullet.n = function(id, direction, position) {
  const entity = Entity.n(id, EntityType.BULLET, position, Bullet.SIZE);
  return Bullet.create({ entity, direction });
}

Bullet.fromTank = function(id, direction, tank) {
  return Bullet.n(
    id,
    direction,
    Point.n(tank.entity.position.x + Bullet.SIZE / 2, tank.entity.position.y + Bullet.SIZE / 2)
  );
};

Bullet.update = function(bullet, event) {
  const delta = event.delta;
  bullet.entity.position = Point.move(bullet.entity.position, bullet.direction, delta * 0.015);
};


export default Bullet;
