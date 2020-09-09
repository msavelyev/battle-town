import Block from './Block.js';
import Bullet from './Bullet.js';
import Tank from './Tank.js';
import Direction from './Direction.js';
import Entity from './Entity.js';
import EntityType from './EntityType.js';
import BlockType from './BlockType.js';
import shuffleArray from './util/shuffleArray.js';

export default class World {

  constructor(id, width, height, blocks, tanks, bullets) {
    this.authoritative = true;

    this.id = id;
    this.width = width;
    this.height = height;
    this.blocks = blocks;
    this.tanks = tanks;
    this.bullets = bullets;
  }

  addTank(tank) {
    this.tanks.push(tank);
  }

  removeTank(id) {
    this.tanks = this.tanks.filter(tank => tank.id !== id);
  }

  move(id, direction) {
    const tank = this.findTank(id);
    return Tank.move(tank, this, direction);
  }

  findTank(id) {
    return this.tanks.find(tank => tank.id === id);
  }

  shoot(id, direction) {
    if (this.bullets.find(bullet => bullet.id === id)) {
      return false;
    }

    const tank = this.findTank(id);
    const bullet = new Bullet(id, direction, tank.position);
    this.bullets.push(bullet);
    return true;
  }

  collides(entity, onKill) {
    const collisions = [];
    for (let block of this.blocks) {
      if (Block.collides(block, entity)) {
        if (entity.entityType !== EntityType.BULLET) {
          return [block];
        }
        collisions.push(block);
      }
    }

    for (let tank of this.tanks) {
      if (entity.id === tank.id) {
        continue;
      }
      if (Entity.collides(tank, entity)) {
        if (entity.entityType !== EntityType.BULLET) {
          return [tank];
        }

        if (entity.entityType === EntityType.BULLET) {
          this.tanks = this.tanks.filter(t => t !== tank);

          if (onKill) {
            onKill(entity.id, tank);
          }
        }

        collisions.push(tank);
      }
    }

    return collisions;
  }

  update(event, onKill) {
    let deleted = false;
    for (let i = 0; i < this.bullets.length; i++) {
      const bullet = this.bullets[i];
      Bullet.update(bullet, event);

      if (this.collides(bullet, onKill).length > 0) {
        delete this.bullets[i];
        deleted = true;
      }
    }

    if (deleted) {
      this.bullets = this.bullets.filter(bullet => !!bullet);
    }
  }

  placeTank(tank) {
    let newTank = null;

    const spawns = this.blocks.filter(block => block.type === BlockType.SPAWN);
    shuffleArray(spawns)

    for (let spawnBlock of spawns) {
      const position = spawnBlock.position;
      newTank = new Tank(tank.id, tank.name, position, Direction.UP);

      if (this.collides(newTank).length === 0) {
        console.log('placing tank', newTank.id);
        return newTank;
      }
    }

    throw new Error('can\' place tank ' + tank.id);
  }

  sync(world) {
    this.blocks = world.blocks;
    this.tanks = world.tanks;
    this.bullets = world.bullets;
  }

  static create(data) {
    return new World(
      data.id,
      data.width,
      data.height,
      data.blocks,
      data.tanks,
      data.bullets
    )
  }

  toJSON() {
    return {
      id: this.id,
      width: this.width,
      height: this.height,
      blocks: this.blocks,
      tanks: this.tanks,
      bullets: this.bullets
    };
  }

}
