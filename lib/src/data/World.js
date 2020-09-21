import level from '../../../server/src/level.js';
import MessageType from '../proto/MessageType.js';
import log from '../util/log.js';
import randomInt from '../util/randomInt.js';
import Block from './Block.js';
import BlockType from './BlockType.js';
import Bullet from './Bullet.js';
import Direction from './Direction.js';
import Entity from './Entity.js';
import EntityState, {REVIVING_TICKS} from './EntityState.js';
import EntityType from './EntityType.js';
import Explosion from './Explosion.js';
import Point from './Point.js';
import Tank from './Tank.js';
import BlockUpdate from './worldevent/BlockUpdate.js';
import BulletAdd from './worldevent/BulletAdd.js';
import BulletRemove from './worldevent/BulletRemove.js';
import BulletUpdate from './worldevent/BulletUpdate.js';
import ExplosionAdd from './worldevent/ExplosionAdd.js';
import ExplosionRemove from './worldevent/ExplosionRemove.js';
import WorldEventType from './worldevent/WorldEventType.js';

export default class World {

  constructor(id) {
    this.authoritative = true;

    this.id = id;
    this.blocks = [];
    this.tanks = [];
    this.bullets = [];
    this.explosions = [];
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
      return null;
    }
    return Tank.move(tank, world, direction);
  }

  static findTank(world, id) {
    return world.tanks.find(tank => tank.id === id);
  }

  static shoot(world, id, direction) {
    if (world.bullets.find(bullet => bullet.id === id)) {
      return null;
    }

    const tank = World.findTank(world, id);
    if (!tank) {
      return null;
    }
    const bullet = Bullet.create(id, direction, tank);
    world.bullets.push(bullet);
    return new BulletAdd(id, bullet.position, direction);
  }

  static collides(world, entity) {
    const collisions = [];
    for (let block of world.blocks) {
      if (block.id === entity.id) {
        continue;
      }
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

        collisions.push(tank);
      }
    }

    for (let bullet of world.bullets) {
      if (entity.id === bullet.id) {
        continue;
      }

      if (Entity.collides(bullet, entity)) {
        collisions.push(bullet);
      }
    }

    return collisions;
  }

  static update(world, event, onKill) {
    const updates = [];

    const deleted = World.updateBullets(world, event, onKill, updates);
    World.cleanupBullets(world, deleted, event, updates);
    World.cleanupExplosions(world, event, updates);
    World.reviveBlocks(world, event, updates);

    return updates;
  }

  static reviveBlocks(world, event, updates) {
    for (let block of world.blocks) {
      if (block.state !== EntityState.REVIVING) {
        continue;
      }

      const ticksDiff = event.tick - block.revivingSince;

      if (ticksDiff > REVIVING_TICKS) {
        log.info('Going to revive', block.id);
        const collisions = World.collides(world, block);
        log.info('found collisions', collisions);
        if (collisions.length === 0) {
          Block.makeAlive(block);
          updates.push(BlockUpdate.fromBlock(block));
        }
      }
    }
  }

  static updateBullets(world, event, onKill, updates) {
    const deleted = new Set();
    for (let i = 0; i < world.bullets.length; i++) {
      if (deleted.has(i)) {
        continue;
      }

      const bullet = world.bullets[i];

      Bullet.update(bullet, event);
      updates.push(new BulletUpdate(bullet.id, bullet.position));

      const collisions = World.collides(world, bullet);
      if (collisions.length > 0) {
        for (let collision of collisions) {
          if (collision.entityType === EntityType.TANK) {
            if (onKill) {
              onKill(bullet.id, collision.id);
            }
          } else if (collision.entityType === EntityType.BLOCK) {
            World.killBlock(world, collision, updates);
          }
        }

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

    return deleted;
  }

  static killBlock(world, block, updates) {
    if (block.type !== BlockType.BRICK) {
      return;
    }

    block.state = EntityState.DEAD;
    updates.push(BlockUpdate.fromBlock(block));
  }

  static cleanupBullets(world, deleted, event, updates) {
    if (deleted.size === 0) {
      return;
    }

    for (let i of deleted) {
      const bullet = world.bullets[i];
      updates.push(new BulletRemove(bullet.id));
      delete world.bullets[i];

      const explosion = Explosion.fromBullet(bullet, event.tick);
      world.explosions.push(explosion);
      updates.push(ExplosionAdd.fromExplosion(explosion));
    }

    world.bullets = world.bullets.filter(bullet => !!bullet);
  }

  static cleanupExplosions(world, event, updates) {
    world.explosions = world.explosions.filter(explosion => {
      const stillLiving = (explosion.tick + Explosion.LIFETIME_TICKS) > event.tick;
      if (!stillLiving) {
        updates.push(new ExplosionRemove(explosion.id));
      }
      return stillLiving;
    });
  }

  static createTank(world, user) {
    let newTank = null;

    const spawns = world.blocks.filter(block => block.type === BlockType.SPAWN);

    if (spawns.length > 0) {
      for (let spawnBlock of spawns) {
        const position = spawnBlock.position;
        newTank = new Tank(user.id, user.name, position, Direction.UP);

        if (World.collides(world, newTank).length === 0) {
          log.info('placing tank', newTank.id);
          World.addTank(world, newTank);
          return;
        }
      }

      throw new Error('can\' place tank ' + newTank.id);
    } else {
      do {
        const x = randomInt(0, level.WIDTH - 1);
        const y = randomInt(0, level.HEIGHT - 1);

        newTank = new Tank(user.id, user.name, new Point(x, y), Direction.UP);
      } while(World.collides(world, newTank).length > 0);
      log.info('placing tank randomly', newTank.id);

      World.addTank(world, newTank);
    }
  }

  static resetTanks(world, match) {
    world.tanks = [];

    for (let user of match.users) {
      World.createTank(world, user);
    }
  }

  static sync(world, updates, id, unackedMessages) {
    let myTankMoved = false;

    for (let data of updates) {
      switch (data.type) {
        case WorldEventType.BLOCK_REMOVE:
          world.blocks = world.blocks.filter(block => block.id !== data.id);
          break;
        case WorldEventType.BLOCK_UPDATE:
          const block = world.blocks.find(block => block.id === data.id);
          BlockUpdate.toBlock(data, block);
          break;
        case WorldEventType.TANK_ADD:
          World.addTank(world, new Tank(
            data.id,
            data.name,
            data.position,
            data.direction
          ));
          break;
        case WorldEventType.TANK_REMOVE:
          World.removeTank(world, data.id);
          break;
        case WorldEventType.TANK_UPDATE:
          const tank = World.findTank(world, data.id);
          tank.position = data.position;
          tank.name = data.name;
          tank.direction = data.direction;

          if (tank.id === id) {
            myTankMoved = true;
          }

          break;
        case WorldEventType.BULLET_ADD:
          world.bullets = world.bullets.filter(b => b.id !== data.id);
          world.bullets.push(new Bullet(data.id, data.direction, data.position));
          break;
        case WorldEventType.BULLET_REMOVE:
          world.bullets = world.bullets.filter(b => b.id !== data.id);
          break;
        case WorldEventType.BULLET_UPDATE:
          const bullet = world.bullets.find(bullet => bullet.id === data.id);
          if (bullet) {
            bullet.position = data.position;
          } else {
            world.bullets.push(new Bullet(data.id, data.direction, data.position));
          }
          break;
        case WorldEventType.EXPLOSION_ADD:
          world.explosions.push(new Explosion(data.id, data.position, data.tick));
          break;
        case WorldEventType.EXPLOSION_REMOVE:
          world.explosions = world.explosions.filter(explosion => explosion.id !== data.id);
          break;
        case WorldEventType.RESET_LEVEL:
          world.bullets = [];
          world.blocks = data.blocks;
          break;
        case WorldEventType.RESET_TANKS:
          world.tanks = data.tanks;
          break;
      }
    }

    if (myTankMoved) {
      World.reapplyUnackedMessages(world, id, unackedMessages);
    }
  }

  static reapplyUnackedMessages(world, id, unackedMessages) {
    for (let netMessage of unackedMessages) {
      switch (netMessage.type) {
        case MessageType.MOVE:
          const move = netMessage.data;
          World.move(world, id, move.direction);
          break;
        case MessageType.SHOOT:
          break;
      }
    }
  }

  static resetLevel(world, blocks) {
    world.bullets = [];
    world.blocks = blocks;
  }

  static findBlocksByType(world, blockType) {
    return world.blocks.filter(block => block.type === blockType);
  }

}
