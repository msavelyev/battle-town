import level from '../../../server/src/level.js';
import MessageType from '../proto/MessageType.js';
import log from '../util/log.js';
import * as rand from '../util/rand.js';
import * as Block from './entity/Block.js';
import { BlockType } from './entity/BlockType.js';
import * as Bullet from './entity/Bullet.js';
import * as Direction from './primitives/Direction.js';
import * as Entity from './entity/Entity.js';
import { EntityState } from './entity/EntityState.js';
import { EntityType } from './entity/EntityType.js';
import * as Explosion from './entity/Explosion.js';
import * as Point from './primitives/Point.js';
import * as Tank from './entity/Tank.js';
import * as BlockUpdate from './worldevent/BlockUpdate.js';
import * as BulletAdd from './worldevent/BulletAdd.js';
import * as BulletRemove from './worldevent/BulletRemove.js';
import * as BulletUpdate from './worldevent/BulletUpdate.js';
import * as ExplosionAdd from './worldevent/ExplosionAdd.js';
import * as ExplosionRemove from './worldevent/ExplosionRemove.js';
import * as TankAdd from './worldevent/TankAdd.js';
import * as TankUpdate from './worldevent/TankUpdate.js';
import { WorldEventType } from './worldevent/WorldEventType.js';

export function create(id) {
  return {
    authoritative: true,
    id: id,
    blocks: [],
    tanks: [],
    bullets: [],
    explosions: [],
  }
}

function addTank(world, tank) {
  world.tanks.push(tank);
}

export function removeTank(world, id) {
  world.tanks = world.tanks.filter(tank => tank.id !== id);
}

export function move(world, id, direction) {
  const tank = findTank(world, id);
  if (!tank || tank.state === EntityState.DEAD) {
    return null;
  }
  return Tank.move(tank, world, direction);
}

export function findTank(world, id) {
  return world.tanks.find(tank => tank.id === id);
}

export function shoot(world, id, direction) {
  if (world.bullets.find(bullet => bullet.id === id)) {
    return null;
  }

  const tank = findTank(world, id);
  if (!tank) {
    return null;
  }

  if (tank.state === EntityState.DEAD) {
    return null;
  }

  const bullet = Bullet.fromTank(id, direction, tank);
  world.bullets.push(bullet);
  return BulletAdd.create(id, bullet.position, direction);
}

export function collides(world, entity) {
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

export function update(world, event, onKill) {
  const updates = [];

  const deleted = updateBullets(world, event, onKill, updates);
  cleanupBullets(world, deleted, event, updates);
  cleanupExplosions(world, event, updates);
  reviveBlocks(world, event, updates);
  reviveTanks(world, event, updates);

  return updates;
}

function reviveTanks(world, event, updates) {
  updateEntitiesState(
    world,
    world.tanks,
    event,
    EntityState.DEAD,
    Entity.DEAD_TICKS,
    tank => {
      removeTank(world, tank.id);
      let newTank = createTank(world, tank);
      newTank = Entity.revive(newTank, event.tick);
      replaceTank(world, newTank);
      updates.push(TankUpdate.fromTank(newTank));
    }
  );

  updateEntitiesState(
    world,
    world.tanks,
    event,
    EntityState.REVIVING,
    Entity.REVIVING_TICKS,
    tank => {
      Entity.makeAlive(tank, event.tick);
      updates.push(TankUpdate.fromTank(tank));
    }
  );
}

function reviveBlocks(world, event, updates) {
  updateEntitiesState(
    world,
    world.blocks,
    event,
    EntityState.REVIVING,
    Entity.REVIVING_TICKS,
    block => {
      if (collides(world, block).length > 0) {
        return;
      }
      Entity.makeAlive(block, event.tick);
      updates.push(BlockUpdate.fromBlock(block));
    }
  );
}

function updateEntitiesState(world, entities, event, fromState, ticksThreshold, onUpdate) {
  for (let entity of entities) {
    if (entity.state !== fromState) {
      continue;
    }

    const ticksDiff = event.tick - entity.stateSince;

    if (ticksDiff > ticksThreshold) {
      onUpdate(entity);
    }
  }
}

function updateBullets(world, event, onKill, updates) {
  const deleted = new Set();
  for (let i = 0; i < world.bullets.length; i++) {
    if (deleted.has(i)) {
      continue;
    }

    let bullet = world.bullets[i];

    bullet = Bullet.update(bullet, event);
    replaceBullet(world, bullet);
    updates.push(BulletUpdate.create(bullet.id, bullet.position));

    const collisions = collides(world, bullet);
    if (collisions.length > 0) {
      for (let collision of collisions) {
        if (collision.entityType === EntityType.TANK) {
          if (onKill) {
            onKill(bullet.id, collision.id);
          }
        } else if (collision.entityType === EntityType.BLOCK) {
          killBlock(world, collision, updates);
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

function killBlock(world, block, updates) {
  if (block.type !== BlockType.BRICK) {
    return;
  }

  Entity.kill(block, null);
  updates.push(BlockUpdate.fromBlock(block));
}

function cleanupBullets(world, deleted, event, updates) {
  if (deleted.size === 0) {
    return;
  }

  for (let i of deleted) {
    const bullet = world.bullets[i];
    updates.push(BulletRemove.create(bullet.id));
    delete world.bullets[i];

    const explosion = Explosion.fromBullet(bullet, event.tick);
    world.explosions.push(explosion);
    updates.push(ExplosionAdd.fromExplosion(explosion));
  }

  world.bullets = world.bullets.filter(bullet => !!bullet);
}

function cleanupExplosions(world, event, updates) {
  world.explosions = world.explosions.filter(explosion => {
    const stillLiving = (explosion.tick + Explosion.LIFETIME_TICKS) > event.tick;
    if (!stillLiving) {
      updates.push(ExplosionRemove.create(explosion.id));
    }
    return stillLiving;
  });
}

export function createTank(world, user) {
  let newTank = null;

  const spawns = world.blocks.filter(block => block.type === BlockType.SPAWN);

  if (spawns.length > 0) {
    for (let spawnBlock of spawns) {
      const position = spawnBlock.position;
      newTank = Tank.create(user.id, user.name, position, Direction.Direction.UP);

      if (collides(world, newTank).length === 0) {
        log.info('placing tank', newTank.id);
        addTank(world, newTank);
        return newTank;
      }
    }

    throw new Error('can\' place tank ' + newTank.id);
  } else {
    do {
      const x = rand.randomInt(0, level.WIDTH - 1);
      const y = rand.randomInt(0, level.HEIGHT - 1);

      newTank = Tank.create(user.id, user.name, Point.create(x, y), Direction.Direction.UP);
    } while(collides(world, newTank).length > 0);
    log.info('placing tank randomly', newTank.id);

    addTank(world, newTank);
    return newTank;
  }
}

export function resetTanks(world, match) {
  world.tanks = [];

  for (let user of match.users) {
    createTank(world, user);
  }
}

export function sync(world, updates, id, unackedMessages) {
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
      {
        let tank = Tank.create(
          data.id,
          data.name,
          data.position,
          data.direction
        );
        tank = TankAdd.toTank(data, tank);
        addTank(world, tank);
      }
        break;
      case WorldEventType.TANK_REMOVE:
        removeTank(world, data.id);
        break;
      case WorldEventType.TANK_UPDATE:
        const tank = findTank(world, data.id);
        TankUpdate.toTank(data, tank);

        if (tank.id === id) {
          myTankMoved = true;
        }

        break;
      case WorldEventType.BULLET_ADD:
        world.bullets = world.bullets.filter(b => b.id !== data.id);
        world.bullets.push(Bullet.create(data.id, data.direction, data.position));
        break;
      case WorldEventType.BULLET_REMOVE:
        world.bullets = world.bullets.filter(b => b.id !== data.id);
        break;
      case WorldEventType.BULLET_UPDATE:
        let bullet = world.bullets.find(bullet => bullet.id === data.id);
        if (bullet) {
          bullet = Bullet.setPosition(bullet, data.position);
          replaceBullet(world, bullet);
        } else {
          world.bullets.push(Bullet.create(data.id, data.direction, data.position));
        }
        break;
      case WorldEventType.EXPLOSION_ADD:
        world.explosions.push(Explosion.create(data.id, data.position, data.tick));
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
    reapplyUnackedMessages(world, id, unackedMessages);
  }
}

function reapplyUnackedMessages(world, id, unackedMessages) {
  for (let netMessage of unackedMessages) {
    switch (netMessage.type) {
      case MessageType.MOVE:
        const tankMove = netMessage.data;
        move(world, id, tankMove.direction);
        break;
      case MessageType.SHOOT:
        break;
    }
  }
}

export function resetLevel(world, blocks) {
  world.bullets = [];
  world.blocks = blocks;
}

export function findBlocksByType(world, blockType) {
  return world.blocks.filter(block => block.type === blockType);
}

export function newTank(world, tick, user) {
  let tank = createTank(world, user);
  tank = Entity.revive(tank, tick);
  replaceTank(world, tank);
  return TankAdd.fromTank(tank);
}

export function replaceTank(world, newTank) {
  world.tanks = world.tanks.map(tank => {
    return tank.id === newTank.id ? newTank : tank;
  });
}

export function replaceBlock(world, newBlock) {
  world.blocks = world.blocks.map(block => {
    return block.id === newBlock.id ? newBlock : block;
  });
}

export function replaceBullet(world, newBullet) {
  world.bullets = world.bullets.map(bullet => {
    return bullet.id === newBullet.id ? newBullet : bullet;
  });
}
