const InfiniteLevel = require('@Lib/tanks/lib/level/InfiniteLevel.js');
const Level = require('@Lib/tanks/lib/level/Level.js');
const MessageType = require('@Lib/tanks/lib/proto/MessageType.js');
const {copy, array, freeze, push, filter, map, concat} = require('@Lib/tanks/lib/util/immutable.js');
const log = require('@Lib/tanks/lib/util/log.js');
const rand = require('@Lib/tanks/lib/util/rand.js');
const Block = require('@Lib/tanks/lib/data/entity/Block.js');
const BlockType = require('@Lib/tanks/lib/data/entity/BlockType.js');
const Bullet = require('@Lib/tanks/lib/data/entity/Bullet.js');
const Direction = require('@Lib/tanks/lib/data/primitives/Direction.js');
const Entity = require('@Lib/tanks/lib/data/entity/Entity.js');
const EntityState = require('@Lib/tanks/lib/data/entity/EntityState.js');
const {EntityType} = require('@Lib/tanks/lib/data/entity/EntityType.js');
const Explosion = require('@Lib/tanks/lib/data/entity/Explosion.js');
const Point = require('@Lib/tanks/lib/data/primitives/Point.js');
const Tank = require('@Lib/tanks/lib/data/entity/Tank.js');
const BlockInvisible = require('@Lib/tanks/lib/data/worldevent/BlockInvisible.js');
const BlockUpdate = require('@Lib/tanks/lib/data/worldevent/BlockUpdate.js');
const BlockVisible = require('@Lib/tanks/lib/data/worldevent/BlockVisible.js');
const BulletAdd = require('@Lib/tanks/lib/data/worldevent/BulletAdd.js');
const BulletRemove = require('@Lib/tanks/lib/data/worldevent/BulletRemove.js');
const BulletUpdate = require('@Lib/tanks/lib/data/worldevent/BulletUpdate.js');
const ExplosionAdd = require('@Lib/tanks/lib/data/worldevent/ExplosionAdd.js');
const ExplosionRemove = require('@Lib/tanks/lib/data/worldevent/ExplosionRemove.js');
const TankAdd = require('@Lib/tanks/lib/data/worldevent/TankAdd.js');
const TankUpdate = require('@Lib/tanks/lib/data/worldevent/TankUpdate.js');
const {WorldEventType} = require('@Lib/tanks/lib/data/worldevent/WorldEventType.js');

/**
 * @typedef {Object} World
 * @property {boolean} authoritative
 * @property {string} id
 * @property {Array.<Block>} blocks
 * @property {Array.<Tank>} tanks
 * @property {Array.<Bullet>} bullets
 * @property {Array.<Explosion>} explosions
 */

/**
 * @param {string} id
 * @return {World}
 */
function create(id) {
  return freeze({
    authoritative: true,
    id: id,
    blocks: array(),
    tanks: array(),
    bullets: array(),
    explosions: array(),
  });
}
module.exports.create = create;

/**
 * @modifying
 *
 * @param {World} world
 * @param {Tank} tank
 * @return {World}
 */
function addTank(world, tank) {
  return copy(world, {
    tanks: push(world.tanks, tank)
  });
}

/**
 * @modifying
 *
 * @param {World} world
 * @param {string} id
 * @returns {World}
 */
function removeTank(world, id) {
  return copy(world, {
    tanks: filter(world.tanks, tank => tank.id !== id)
  })
}
module.exports.removeTank = removeTank;

/**
 * @modifying
 *
 * @param {World} world
 * @param {string} id
 * @param {Direction} direction
 * @param {Array} updates
 * @returns {World}
 */
function move(world, id, direction, updates) {
  let tank = findTank(world, id);
  if (!tank || tank.state === EntityState.DEAD) {
    return world;
  }

  const oldTank = tank;
  tank = Tank.move(tank, world, direction);
  if (tank) {
    updates.push(TankUpdate.fromTank(tank));

    if (world.authoritative) {
      for (let newBlock of InfiniteLevel.blocksDiff(oldTank.position, tank.position)) {
        updates.push(BlockVisible.create(newBlock, id));
        world = updateBlockVisibility(world, newBlock, +1);
      }
      for (let oldBlock of InfiniteLevel.blocksDiff(tank.position, oldTank.position)) {
        updates.push(BlockInvisible.create(oldBlock.id, id));
        world = updateBlockVisibility(world, oldBlock, -1);
      }
    }

    world = replaceTank(world, tank);

    return world;
  } else {
    return world;
  }
}
module.exports.move = move;

/**
 * @selector
 *
 * @param {World} world
 * @param {string} id
 * @returns {Tank}
 */
function findTank(world, id) {
  return world.tanks.find(tank => tank.id === id);
}
module.exports.findTank = findTank;

/**
 * @selector
 *
 * @param {World} world
 * @param {string} id
 * @returns {Block}
 */
function findBlock(world, id) {
  return world.blocks.find(block => block.id === id);
}

/**
 * @modifying
 *
 * @param {World} world
 * @param {string} id
 * @param {Direction} direction
 * @param {Array} updates
 * @returns {World}
 */
function shoot(world, id, direction, updates) {
  if (world.bullets.find(bullet => bullet.id === id)) {
    return world;
  }

  const tank = findTank(world, id);
  if (!tank) {
    return world;
  }

  if (tank.state === EntityState.DEAD) {
    return world;
  }

  const bullet = Bullet.fromTank(id, direction, tank);
  world = copy(world, {
    bullets: push(world.bullets, bullet),
  });

  updates.push(BulletAdd.create(id, bullet.position, direction));

  return world;
}
module.exports.shoot = shoot;

/**
 * @selector
 *
 * @param {World} world
 * @param {Entity} entity
 */
function collides(world, entity) {
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
module.exports.collides = collides;

/**
 * @callback WorldOnKill
 * @param {string} killerId
 * @param {string} victimId
 * @returns {World}
 */
/**
 * @modifying
 *
 * @param {World} world
 * @param event
 * @param {WorldOnKill} onKill
 * @param {Array} updates
 * @returns {World}
 */
function update(world, event, onKill, updates) {
  const deleted = new Set();
  world = updateBullets(world, event, onKill, deleted, updates);
  world = cleanupBullets(world, deleted, event, updates);
  world = cleanupExplosions(world, event, updates);
  world = reviveBlocks(world, event, updates);
  world = reviveTanks(world, event, updates);

  return world;
}
module.exports.update = update;

/**
 * @modifying
 *
 * @param {World} world
 * @param event
 * @param {Array} updates
 * @returns {World}
 */
function reviveTanks(world, event, updates) {
  world = updateEntitiesState(
    world,
    world.tanks,
    event,
    EntityState.DEAD,
    Entity.DEAD_TICKS,
    (world, tank) => {
      world = removeTank(world, tank.id);
      let newTank = createTank(world, tank);
      world = addTank(world, newTank);
      newTank = Entity.revive(newTank, event.tick);
      world = replaceTank(world, newTank);
      updates.push(TankUpdate.fromTank(newTank));
      return world;
    }
  );

  world = updateEntitiesState(
    world,
    world.tanks,
    event,
    EntityState.REVIVING,
    Entity.REVIVING_TICKS,
    (world, tank) => {
      tank = Entity.makeAlive(tank, event.tick);
      world = replaceTank(world, tank);
      updates.push(TankUpdate.fromTank(tank));
      return world;
    }
  );

  return world;
}

/**
 * @modifying
 *
 * @param {World} world
 * @param event
 * @param {Array} updates
 * @returns {World}
 */
function reviveBlocks(world, event, updates) {
  return updateEntitiesState(
    world,
    world.blocks,
    event,
    EntityState.REVIVING,
    Entity.REVIVING_TICKS,
    (world, block) => {
      if (collides(world, block).length > 0) {
        return world;
      }
      block = Entity.makeAlive(block, event.tick);
      world = replaceBlock(world, block);
      updates.push(BlockUpdate.fromBlock(block));
      return world;
    }
  );
}

/**
 * @callback OnUpdate
 * @param {World} world
 * @param {Entity} entity
 * @returns {World}
 */
/**
 * @modifying
 *
 * @param {World} world
 * @param {Array.<Entity>} entities
 * @param event
 * @param {EntityState} fromState
 * @param {number} ticksThreshold
 * @param {OnUpdate} onUpdate
 */
function updateEntitiesState(world, entities, event, fromState, ticksThreshold, onUpdate) {
  for (let entity of entities) {
    if (entity.state !== fromState) {
      continue;
    }

    const ticksDiff = event.tick - entity.stateSince;

    if (ticksDiff > ticksThreshold) {
      world = onUpdate(world, entity);
    }
  }

  return world;
}

/**
 * @modifying
 *
 * @param {World} world
 * @param event
 * @param {WorldOnKill} onKill
 * @param {Set} deleted
 * @param {Array} updates
 * @returns {World}
 */
function updateBullets(world, event, onKill, deleted, updates) {
  const updatedBullets = map(world.bullets, bullet => {
    const newBullet = Bullet.update(bullet, event);
    updates.push(BulletUpdate.create(newBullet.id, newBullet.position));
    return newBullet;
  });

  world = copy(world, {
    bullets: updatedBullets
  });

  for (let bullet of world.bullets) {
    const collisions = collides(world, bullet);
    if (collisions.length === 0) {
      continue;
    }

    for (let collision of collisions) {
      if (collision.entityType === EntityType.TANK) {
        if (onKill) {
          world = onKill(bullet.id, collision.id);
        }
      } else if (collision.entityType === EntityType.BLOCK) {
        world = killBlock(world, collision, event, updates);
      }
    }

    for (let otherBullet of world.bullets) {
      if (otherBullet === bullet) {
        continue;
      }

      if (deleted.has(otherBullet.id)) {
        continue;
      }

      if (Entity.collides(bullet, otherBullet)) {
        deleted.add(bullet.id);
        deleted.add(otherBullet.id);
      }
    }

    deleted.add(bullet.id);
  }

  return world;
}

/**
 * @modifying
 *
 * @param {World} world
 * @param {Block} block
 * @param event
 * @param {Array} updates
 * @returns {World}
 */
function killBlock(world, block, event, updates) {
  if (block.type !== BlockType.BRICK) {
    return world;
  }

  block = Entity.kill(block, event.tick);
  world = replaceBlock(world, block);
  updates.push(BlockUpdate.fromBlock(block));

  return world;
}

/**
 * @modifying
 *
 * @param {World} world
 * @param {Set} deleted
 * @param event
 * @param {Array} updates
 * @returns {World}
 */
function cleanupBullets(world, deleted, event, updates) {
  if (deleted.size === 0) {
    return world;
  }

  const deletedBullets = filter(world.bullets, bullet => {
    return deleted.has(bullet.id);
  });

  for (let bullet of deletedBullets) {
    updates.push(BulletRemove.create(bullet.id));
  }

  const newExplosions = map(deletedBullets, bullet => {
    return Explosion.fromBullet(bullet, event.tick);
  });

  for (let explosion of newExplosions) {
    updates.push(ExplosionAdd.fromExplosion(explosion));
  }

  return copy(world, {
    bullets: filter(world.bullets, bullet => {
      return !deleted.has(bullet.id);
    }),
    explosions: concat(world.explosions, newExplosions),
  })
}

/**
 * @modifying
 *
 * @param {World} world
 * @param event
 * @param {Array} updates
 * @returns {World}
 */
function cleanupExplosions(world, event, updates) {
  return copy(world, {
    explosions: filter(world.explosions, explosion => {
      const stillLiving = (explosion.tick + Explosion.LIFETIME_TICKS) > event.tick;
      if (!stillLiving) {
        updates.push(ExplosionRemove.create(explosion.id));
      }
      return stillLiving;
    })
  });
}

/**
 * @selector
 *
 * @param {World} world
 * @param {User} user
 * @returns {Tank}
 */
function createTank(world, user) {
  let newTank;

  const spawns = findBlocksByType(world, BlockType.SPAWN);

  if (spawns.length > 0) {
    for (let spawnBlock of spawns) {
      const position = spawnBlock.position;
      newTank = Tank.create(user.id, user.name, position, Direction.Direction.UP);

      if (collides(world, newTank).length === 0) {
        log.info('placing tank', newTank.id);
        return newTank;
      }
    }

    throw new Error('can\' place tank ' + newTank.id);
  } else {
    do {
      let x = rand.randomInt(0, InfiniteLevel.SAFE_AREA_SIZE);
      let y = rand.randomInt(0, InfiniteLevel.SAFE_AREA_SIZE);
      x = x - x % Level.BLOCK_SIZE;
      y = y - y % Level.BLOCK_SIZE;

      newTank = Tank.create(user.id, user.name, Point.create(x, y), Direction.Direction.UP);
    } while(collides(world, newTank).length > 0);
    log.info('placing tank randomly', newTank.id);

    return newTank;
  }
}
module.exports.createTank = createTank;

/**
 * @modifying
 *
 * @param {World} world
 * @param {Match} match
 * @returns {World}
 */
function resetTanks(world, match) {
  world = copy(world, {
    tanks: array()
  });

  for (let user of match.users) {
    const tank = createTank(world, user);
    world = addTank(world, tank);
  }

  return world;
}
module.exports.resetTanks = resetTanks;

/**
 * @modifying
 *
 * @param {World} world
 * @param {Array} updates
 * @param {string} id
 * @param {Array} unackedMessages
 */
function sync(world, updates, id, unackedMessages) {
  let myTankMoved = false;

  for (let data of updates) {
    switch (data.type) {
      case WorldEventType.BLOCK_REMOVE:
        world = copy(world, {
          blocks: world.blocks.filter(block => block.id !== data.id)
        });
        break;
      case WorldEventType.BLOCK_UPDATE:
        let block = world.blocks.find(block => block.id === data.id);
        block = BlockUpdate.toBlock(data, block);
        world = replaceBlock(world, block);
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
        world = addTank(world, tank);
      }
        break;
      case WorldEventType.TANK_REMOVE:
        world = removeTank(world, data.id);
        break;
      case WorldEventType.TANK_UPDATE:
        let tank = findTank(world, data.id);
        tank = TankUpdate.toTank(data, tank);
        world = replaceTank(world, tank);

        if (tank.id === id) {
          myTankMoved = true;
        }

        break;
      case WorldEventType.BULLET_ADD:
        const otherBullets = filter(world.bullets, b => b.id !== data.id);
        world = copy(world, {
          bullets: push(otherBullets, Bullet.create(data.id, data.direction, data.position))
        });
        break;
      case WorldEventType.BULLET_REMOVE:
        world = copy(world, {
          bullets: filter(world.bullets, b => b.id !== data.id)
        });
        break;
      case WorldEventType.BULLET_UPDATE:
        let bullet = world.bullets.find(bullet => bullet.id === data.id);
        if (bullet) {
          bullet = Bullet.setPosition(bullet, data.position);
          world = replaceBullet(world, bullet);
        } else {
          world = copy(world, {
            bullets: push(world.bullets, Bullet.create(data.id, data.direction, data.position))
          });
        }
        break;
      case WorldEventType.EXPLOSION_ADD:
        world = copy(world, {
          explosions: push(world.explosions, Explosion.create(data.id, data.position, data.tick))
        });
        break;
      case WorldEventType.EXPLOSION_REMOVE:
        world = copy(world, {
          explosions: filter(world.explosions, explosion => explosion.id !== data.id)
        });
        break;
      case WorldEventType.RESET_LEVEL:
        world = copy(world, {
          bullets: array(),
          blocks: freeze(data.blocks),
        });
        break;
      case WorldEventType.RESET_TANKS:
        world = copy(world, {
          tanks: freeze(data.tanks)
        });
        break;
      case WorldEventType.BLOCK_VISIBLE:
        world = copy(world, {
          blocks: push(world.blocks, data.block),
        });
        break;
      case WorldEventType.BLOCK_INVISIBLE:
        world = copy(world, {
          blocks: filter(world.blocks, block => {
            return block.id !== data.id;
          })
        });
        break;
    }
  }

  if (myTankMoved) {
    world = reapplyUnackedMessages(world, id, unackedMessages);
  }

  return world;
}
module.exports.sync = sync;

/**
 * @modifying
 *
 * @param {World} world
 * @param {string} id
 * @param {Array} unackedMessages
 * @returns {World}
 */
function reapplyUnackedMessages(world, id, unackedMessages) {
  for (let netMessage of unackedMessages) {
    switch (netMessage.type) {
      case MessageType.MOVE:
        const tankMove = netMessage.data;
        world = move(world, id, tankMove.direction, []);
        break;
      case MessageType.SHOOT:
        break;
    }
  }

  return world;
}

/**
 * @modifying
 *
 * @param {World} world
 * @param {Array.<Block>} blocks
 * @returns {World}
 */
function resetLevel(world, blocks) {
  return copy(world, {
    bullets: array(),
    blocks: freeze(blocks)
  });
}
module.exports.resetLevel = resetLevel;

/**
 * @selector
 *
 * @param {World} world
 * @param {BlockType} blockType
 * @returns {Block}
 */
function findBlocksByType(world, blockType) {
  return world.blocks.filter(block => block.type === blockType);
}
module.exports.findBlocksByType = findBlocksByType;

/**
 * @modifying
 *
 * @param {World} world
 * @param {number} tick
 * @param {User} user
 * @param {Array} updates
 * @returns {World}
 */
function newTank(world, tick, user, updates) {
  let tank = createTank(world, user);
  world = addTank(world, tank);
  tank = Entity.revive(tank, tick);
  world = replaceTank(world, tank);
  updates.push(TankAdd.fromTank(tank));
  return world;
}
module.exports.newTank = newTank;

/**
 * @nosideeffects
 */
function replace(items, newItem) {
  return items.map(oldItem => {
    return oldItem.id === newItem.id ? newItem : oldItem;
  });
}

/**
 * @modifying
 *
 * @param {World} world
 * @param {Tank} newTank
 * @returns {World}
 */
function replaceTank(world, newTank) {
  return copy(world, {
    tanks: replace(world.tanks, newTank)
  });
}
module.exports.replaceTank = replaceTank;

/**
 * @modifying
 *
 * @param {World} world
 * @param {Block} newBlock
 * @returns {World}
 */
function replaceBlock(world, newBlock) {
  return copy(world, {
    blocks: replace(world.blocks, newBlock)
  });
}
module.exports.replaceBlock = replaceBlock;

/**
 * @modifying
 *
 * @param {World} world
 * @param {Bullet} newBullet
 * @returns {World}
 */
function replaceBullet(world, newBullet) {
  return copy(world, {
    bullets: replace(world.bullets, newBullet)
  });
}
module.exports.replaceBullet = replaceBullet;

function updateBlockVisibility(world, block, delta) {
  const oldBlock = findBlock(world, block.id);
  if (!oldBlock && delta < 0) {
    throw new Error('WTF, no block ' + block.id + 'to reduce visibility');
  }

  if (!oldBlock) {
    return copy(world, {
      blocks: push(world.blocks, copy(block, {
        visibleBy: delta
      }))
    });
  }

  if (delta < 0 && oldBlock.visibleBy === 1) {
    return copy(world, {
      blocks: filter(world.blocks, b => {
        return b.id !== block.id;
      })
    });
  }

  const newBlock = copy(block, {
    visibleBy: block.visibleBy + delta
  });
  return replaceBlock(world, newBlock);
}
module.exports.updateBlockVisibility = updateBlockVisibility;
