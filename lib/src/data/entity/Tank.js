import { copy } from '../../util/immutable.js';
import * as Direction from '../primitives/Direction.js';
import * as Point from '../primitives/Point.js';
import * as World from '../World.js';
import * as Entity from './Entity.js';
import {EntityType} from './EntityType.js';

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

export function create(id, name, position, direction) {
  const entity = Entity.create(id, EntityType.TANK, position, 4);
  return copy(entity, {
    name: name,
    direction: direction,
    speed: 0.2,
  });
}

/**
 * @modifying
 *
 * @template T
 * @param {T} tank
 * @param world
 * @param direction
 * @return {T}
 */
export function move(tank, world, direction) {
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
