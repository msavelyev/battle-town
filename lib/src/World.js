import Block from './Block.js';
import Bullet from './Bullet.js';
import Tank from './Tank.js';
import Direction from './Direction.js';
import Entity from './Entity.js';
import EntityType from './EntityType.js';
import BlockType from './BlockType.js';

export default class World {

  constructor(id, width, height) {
    this.authoritative = true;

    this.id = id;
    this.width = width;
    this.height = height;
    this.blocks = [];
    this.tanks = [];
    this.bullets = [];
  }

  static addTank(world, tank) {
    world.tanks.push(tank);
  }

  static removeTank(world, id) {
    world.tanks = world.tanks.filter(tank => tank.id !== id);
  }

  static move(world, id, direction) {
    const tank = World.findTank(world, id);
    if (!tank) {
      return false;
    }
    return Tank.move(tank, world, direction);
  }

  static findTank(world, id) {
    return world.tanks.find(tank => tank.id === id);
  }

  static shoot(world, id, direction) {
    if (world.bullets.find(bullet => bullet.id === id)) {
      return false;
    }

    const tank = World.findTank(world, id);
    const bullet = new Bullet(id, direction, tank.position);
    world.bullets.push(bullet);
    return true;
  }

  static collides(world, entity, onKill) {
    const collisions = [];
    for (let block of world.blocks) {
      if (Block.collides(block, entity)) {
        if (entity.entityType !== EntityType.BULLET) {
          return [block];
        }
        collisions.push(block);
      }
    }

    for (let tank of world.tanks) {
      if (entity.id === tank.id) {
        continue;
      }
      if (Entity.collides(tank, entity)) {
        if (entity.entityType !== EntityType.BULLET) {
          return [tank];
        }

        if (entity.entityType === EntityType.BULLET) {
          world.tanks = world.tanks.filter(t => t !== tank);

          if (onKill) {
            onKill(entity.id);
          }
        }

        collisions.push(tank);
      }
    }

    return collisions;
  }

  static update(world, event, onKill) {
    let deleted = false;
    for (let i = 0; i < world.bullets.length; i++) {
      const bullet = world.bullets[i];
      if (!bullet) {
        continue;
      }

      Bullet.update(bullet, event);

      if (World.collides(world, bullet, onKill).length > 0) {
        delete world.bullets[i];
        deleted = true;
      }

      for (let j = 0; j < world.bullets.length; j++) {
        if (j === i) {
          continue;
        }

        const otherBullet = world.bullets[j];
        if (!otherBullet) {
          continue;
        }

        if (Entity.collides(bullet, otherBullet)) {
          console.log('bullets', bullet, otherBullet, 'collide');
          delete world.bullets[i];
          delete world.bullets[j];
          deleted = true;
        }
      }
    }

    if (deleted) {
      world.bullets = world.bullets.filter(bullet => !!bullet);
    }
  }

  static createTank(world, user) {
    let newTank = null;

    const spawns = world.blocks.filter(block => block.type === BlockType.SPAWN);

    for (let spawnBlock of spawns) {
      const position = spawnBlock.position;
      newTank = new Tank(user.id, user.name, position, Direction.UP);

      if (World.collides(world, newTank).length === 0) {
        console.log('placing tank', newTank.id);
        World.addTank(world, newTank);
        return;
      }
    }

    throw new Error('can\' place tank ' + tank.id);
  }

  static resetTanks(world, match) {
    world.tanks = [];

    for (let user of match.users) {
      World.createTank(world, user);
    }
  }

  static sync(world, data) {
    world.blocks = data.blocks;
    world.tanks = data.tanks;
    world.bullets = data.bullets;
  }

  static resetLevel(world, blocks) {
    world.blocks = blocks;
  }

}
