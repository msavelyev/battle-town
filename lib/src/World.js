import Block from './Block.js';
import Bullet from './Bullet.js';
import Tank from './Tank.js';
import randomInt from './randomInt.js';
import Point from './Point.js';
import Direction from './Direction.js';

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

  removeTank(id) {
    this.tanks = this.tanks.filter(tank => tank.id !== id);
    delete this.score[id];
  }

  moveTank(id, direction) {
    const tank = this.findTank(id);
    const newTank = new Tank(
      tank.id,
      tank.newPosition(direction),
      tank.color,
      direction
    );

    if (!this.collides(newTank, entity => entity.id !== tank.id)) {
      tank.move(direction);
    } else {
      tank.direction = direction;
    }
  }

  findTank(id) {
    return this.tanks.find(tank => tank.id === id);
  }

  shoot(id) {
    if (this.bullets.find(bullet => bullet.id === id)) {
      return;
    }

    const tank = this.findTank(id);
    const bullet = tank.shoot();
    this.bullets.push(bullet);
  }

  collides(entity, filter) {
    if (!filter) {
      filter = _ => true;
    }

    for (let block of this.blocks) {
      if (filter(block) && block.collides(entity)) {
        return true;
      }
    }

    for (let tank of this.tanks) {
      if (filter(tank) && tank.collides(entity)) {
        if (entity instanceof Bullet) {
          if (this.tankDestroyedCb) {
            this.tankDestroyedCb(tank);
          }

          this.tanks = this.tanks.filter(t => t !== tank);
          this.score[entity.id] += 1;
        }
        return true;
      }
    }

    return false;
  }

  update(event) {
    let deleted = false;
    for (let i = 0; i < this.bullets.length; i++) {
      const bullet = this.bullets[i];
      bullet.update(event);

      if (this.collides(bullet, entity => entity.id !== bullet.id)) {
        delete this.bullets[i];
        deleted = true;
      }
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
      const x = randomInt(0, this.width / World.BLOCK_SIZE - 1);
      const y = randomInt(0, this.height / World.BLOCK_SIZE - 1);

      newTank = new Tank(tank.id, new Point(x, y), tank.color, Direction.UP);
      console.log('trying new position', newTank.position);
    } while(this.collides(newTank));

    this.tanks.push(newTank);

    return newTank;
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
