const {copy} = require('@Lib/tanks/lib/util/immutable.js');
const Direction = require('@Lib/tanks/lib/data/primitives/Direction.js');
const {DirectionType} = require('@Lib/tanks/lib/data/primitives/DirectionType.js');
const Point = require('@Lib/tanks/lib/data/primitives/Point.js');
const Entity = require('@Lib/tanks/lib/data/entity/Entity.js');
const {EntityType} = require('@Lib/tanks/lib/data/entity/EntityType.js');

/**
 * @typedef {Entity} BulletOnly
 * @property {Direction} direction
 *
 * @typedef {Entity & BulletOnly} Bullet
 */

const BULLET_SPEED = 0.03;

/**
 *
 *
 * @param {Tank} tank
 * @param {Direction} direction
 * @returns {Point}
 */
function bulletPosition(tank, direction) {
  switch (direction) {
    case Direction.Direction.UP:
      return Point.create(tank.position.x, tank.position.y);
    case Direction.Direction.DOWN:
      return Point.create(tank.position.x, tank.position.y + tank.size - size() / 2);
    case Direction.Direction.LEFT:
      return Point.create(tank.position.x, tank.position.y);
    case Direction.Direction.RIGHT:
      return Point.create(tank.position.x + tank.size - size() / 2, tank.position.y);
    default:
      throw new Error('Unknown direction ' + direction);
  }
}

/**
 *
 * @param {string} id
 * @param {Direction} direction
 * @param {Point} position
 * @returns {Bullet}
 */
function create(id, direction, position) {
  const entity = Entity.create(id, EntityType.BULLET, position, size())

  let height;
  let width;
  if (Direction.type(direction) === DirectionType.HORIZONTAL) {
    height = entity.height * 2;
    width = entity.width / 2;
  } else {
    height = entity.height / 2;
    width = entity.width * 2;
  }

  return copy(entity, {
    direction,
    height,
    width
  });
}
module.exports.create = create;

/**
 *
 * @returns {number}
 */
function size() {
  return 2;
}
module.exports.size = size;

/**
 *
 * @param {string} id
 * @param {Direction} direction
 * @param {Tank} tank
 * @returns {Bullet}
 */
function fromTank(id, direction, tank) {
  return create(
    id,
    direction,
    bulletPosition(tank, direction)
  );
}
module.exports.fromTank = fromTank;

/**
 *
 * @param {Bullet} bullet
 * @param event
 * @returns {Bullet}
 */
function update(bullet, event) {
  const delta = event.delta;
  return setPosition(bullet, Point.move(bullet.position, bullet.direction, delta * BULLET_SPEED));
}
module.exports.update = update;

/**
 *
 * @param {Bullet} bullet
 * @param {Point} position
 * @returns {Bullet}
 */
function setPosition(bullet, position) {
  return copy(bullet, { position });
}
module.exports.setPosition = setPosition;
