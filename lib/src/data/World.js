import Block from './Block.js';
import Bullet from './Bullet.js';
import Tank from './Tank.js';
import Direction from './Direction.js';
import Entity from './Entity.js';
import EntityType from './EntityType.js';
import BlockType from './BlockType.js';
import Explosion from './Explosion.js';

import { World } from '../protobuf/Data.js';

World.n = function(id, width, height) {
  const blocks = [];
  const tanks = [];
  const bullets = [];
  const explosions = [];
  const world = World.create({ id, width, height, blocks, tanks, bullets, explosions });
  world.authoritative = true;
  return world;
};

World.addTank = function(world, tank) {
  world.tanks.push(tank);
};

World.removeTank = function(world, id) {
  world.tanks = world.tanks.filter(tank => tank.entity.id !== id);
};

World.move = function(world, id, direction) {
  const tank = World.findTank(world, id);
  if (!tank) {
    return false;
  }
  return Tank.move(tank, world, direction);
};

World.findTank = function(world, id) {
  return world.tanks.find(tank => tank.entity.id === id);
};

World.shoot = function(world, id, direction) {
  if (world.bullets.find(bullet => bullet.entity.id === id)) {
    return false;
  }

  const tank = World.findTank(world, id);
  if (!tank) {
    return false;
  }
  const bullet = Bullet.fromTank(id, direction, tank);
  world.bullets.push(bullet);
  return true;
};

World.collides = function(world, entity, onKill) {
  const collisions = [];
  for (let block of world.blocks) {
    if (Block.collides(block, entity)) {
      if (entity.entity.entityType !== EntityType.BULLET) {
        return [block];
      }
      collisions.push(block);
    }
  }

  for (let tank of world.tanks) {
    if (entity.entity.id === tank.entity.id) {
      continue;
    }
    if (Entity.collides(tank, entity)) {
      if (entity.entity.entityType !== EntityType.BULLET) {
        return [tank];
      }

      if (entity.entity.entityType === EntityType.BULLET) {
        world.tanks = world.tanks.filter(t => t !== tank);

        if (onKill) {
          onKill(entity.entity.id);
        }
      }

      collisions.push(tank);
    }
  }

  return collisions;
};

World.update = function(world, event, onKill) {
  const deleted = new Set();
  for (let i = 0; i < world.bullets.length; i++) {
    if (deleted.has(i)) {
      continue;
    }

    const bullet = world.bullets[i];

    Bullet.update(bullet, event);

    if (World.collides(world, bullet, onKill).length > 0) {
      deleted.add(i);
    }

    for (let j = 0; j < world.bullets.length; j++) {
      if (j === i) {
        continue;
      }

      if (deleted.has(j)) {
        continue;
      }

      const otherBullet = world.bullets[j];

      if (Entity.collides(bullet, otherBullet)) {
        deleted.add(i);
        deleted.add(j);
      }
    }
  }

  if (deleted.size > 0) {
    for (let i of deleted) {
      const bullet = world.bullets[i];
      delete world.bullets[i];

      world.explosions.push(Explosion.fromBullet(bullet, event.tick));
    }

    world.bullets = world.bullets.filter(bullet => !!bullet);
  }

  world.explosions = world.explosions.filter(explosion => {
    return (explosion.tick + Explosion.LIFETIME_TICKS) > event.tick;
  });
};

World.createTank = function(world, user) {
  let newTank = null;

  const spawns = world.blocks.filter(block => block.type === BlockType.SPAWN);

  for (let spawnBlock of spawns) {
    const position = spawnBlock.entity.position;
    newTank = Tank.n(user.id, user.name, position, Direction.UP);

    if (World.collides(world, newTank).length === 0) {
      console.log('placing tank', newTank.entity.id);
      World.addTank(world, newTank);
      return;
    }
  }

  throw new Error('can\' place tank ' + user.id);
};

World.resetTanks = function(world, match) {
  world.tanks = [];

  for (let user of match.users) {
    World.createTank(world, user);
  }
};

World.sync = function(world, data) {
  world.blocks = data.blocks;
  world.tanks = data.tanks;
  world.bullets = data.bullets;
  world.explosions = data.explosions;
};

World.resetLevel = function(world, blocks) {
  world.bullets = [];
  world.blocks = blocks;
};

export default World;
