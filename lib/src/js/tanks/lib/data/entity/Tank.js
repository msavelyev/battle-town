const {copy} = require('@Lib/tanks/lib/util/immutable.js');
const Direction = require('@Lib/tanks/lib/data/primitives/Direction.js');
const Point = require('@Lib/tanks/lib/data/primitives/Point.js');
const World = require('@Lib/tanks/lib/data/World.js');
const Entity = require('@Lib/tanks/lib/data/entity/Entity.js');
const {EntityType} = require('@Lib/tanks/lib/data/entity/EntityType.js');

/**
 *
 * @typedef {Entity} TankOnly
 * @property {string} name
 * @property {Direction} direction
 * @property {number} speed
 *
 * @typedef {Entity & TankOnly} Tank
 */

/**
 *
 * @param {string} id
 * @param {string} name
 * @param {Point} position
 * @param {Direction} direction
 * @returns {Tank}
 */

function create(id, name, position, direction) {
  const entity = Entity.create(id, EntityType.TANK, position, 4);
  return copy(entity, {
    name: name,
    direction: direction,
    speed: 0.2,
  });
}
module.exports.create = create;

/**
 * @modifying
 *
 * @template T
 * @param {T} tank
 * @param world
 * @param direction
 * @return {T}
 */
function move(tank, world, direction) {
  const changingDirectionType = Direction.type(tank.direction) !== Direction.type(direction);
  const changingDirection = tank.direction !== direction;

  let newPosition = Point.move(tank.position, tank.direction, tank.speed);

  if (changingDirectionType) {
    newPosition = Point.round(newPosition);
  }

  const newTank = copy(tank, {
    direction,
    position: newPosition
  });

  if (World.collides(world, newTank).length > 0) {
    if (changingDirection) {
      return copy(tank, {
        direction
      });
    }
    return tank;
  }

  return newTank;
}
module.exports.move = move;
