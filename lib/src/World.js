import Block from './Block.js';
import Bullet from './Bullet.js';
import Tank from './Tank.js';
import randomInt from './randomInt.js';
import Point from './Point.js';
import Direction from './Direction.js';
import Entity from './Entity.js';

export default class World {

  constructor(id, width, height, blocks, tanks, bullets) {
    this.id = id;
    this.width = width;
    this.height = height;
    this.blocks = blocks;
    this.tanks = tanks;
    this.bullets = bullets;
    this.tankDestroyedCb = null;
    this.score = {};

    for (let tank of this.tanks) {
      this.score[tank.id] = 0;
    }
  }

  addTank(tank) {
    this.tanks.push(tank);
    if (!this.score[tank.id]) {
      this.score[tank.id] = 0;
    }
  }

  removeTank(id, cleanScore) {
    this.tanks = this.tanks.filter(tank => tank.id !== id);
    if (cleanScore) {
      delete this.score[id];
    }
  }

  startMoving(id, direction, position) {
    const tank = this.findTank(id);
    tank.start(direction, position);
    return tank;
  }

  stopMoving(id, position) {
    const tank = this.findTank(id);
    tank.stop(position);
    return tank;
  }

  findTank(id) {
    return this.tanks.find(tank => tank.id === id);
  }

  shoot(id, position) {
    if (this.bullets.find(bullet => bullet.id === id)) {
      return;
    }

    const tank = this.findTank(id);
    if (!position) {
      position = tank.position;
    }
    const bullet = tank.shoot(position);
    this.bullets.push(bullet);
  }

  collides(entity) {
    let result = false;
    for (let block of this.blocks) {
      if (block.collides(entity)) {
        result = true;
      }
    }

    for (let tank of this.tanks) {
      if (entity.id === tank.id) {
        continue;
      }
      if (tank.collides(entity)) {
        if (entity instanceof Bullet) {
          this.tanks = this.tanks.filter(t => t !== tank);
          this.score[entity.id] += 1;

          if (this.tankDestroyedCb) {
            this.tankDestroyedCb(tank, entity);
          }
        }
        result = true;
      }
    }

    return result;
  }

  update(event) {
    let deleted = false;
    for (let i = 0; i < this.bullets.length; i++) {
      const bullet = this.bullets[i];
      bullet.update(event);

      if (this.collides(bullet)) {
        delete this.bullets[i];
        deleted = true;
      }
    }

    for (let tank of this.tanks) {
      tank.update(event, this);
    }

    if (deleted) {
      this.bullets = this.bullets.filter(bullet => !!bullet);
    }
  }

  onTankDestroyed(cb) {
    this.tankDestroyedCb = cb;
  }

  placeTank(tank) {
    let newTank = null;

    do {
      const x = randomInt(0, this.width / Entity.BLOCK_SIZE - 1);
      const y = randomInt(0, this.height / Entity.BLOCK_SIZE - 1);

      newTank = new Tank(tank.id, new Point(x, y), tank.color, Direction.UP, false);
    } while(this.collides(newTank));

    return newTank;
  }

  removeBullet(id) {
    this.bullets = this.bullets.filter(bullet => bullet.id !== id);
  }

  sync(world) {
    this.tanks = world.tanks;
    this.bullets = world.bullets;
    this.blocks = world.blocks;
  }

  static create(data) {
    return new World(
      data.id,
      data.width,
      data.height,
      data.blocks.map(block => Block.create(block)),
      data.tanks.map(tank => Tank.create(tank)),
      data.bullets.map(bullet => Bullet.create(bullet))
    )
  }

  static get BLOCK_SIZE() {
    return 32;
  }

}
