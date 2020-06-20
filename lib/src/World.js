import Block from './Block.js';
import Bullet from './Bullet.js';
import Tank from './Tank.js';

export default class World {

  constructor(width, height, blocks, tanks, bullets) {
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

  moveTank(id, direction) {
    const tank = this.findTank(id);
    const newPosition = tank.newPosition(direction);

    if (!this.collides(newPosition)) {
      tank.move(direction);
    } else {
      tank.direction = direction;
    }
  }

  findTank(id) {
    return this.tanks.find(tank => tank.id === id);
  }

  shoot(id) {
    const tank = this.findTank(id);
    const bullet = tank.shoot();
    this.bullets.push(bullet);
  }

  collides(position, filter) {
    if (!filter) {
      filter = block => true;
    }

    for (let block of this.blocks) {
      if (filter(block) && block.collides(position)) {
        return true;
      }
    }

    for (let tank of this.tanks) {
      if (filter(tank) && tank.collides(position)) {
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

      if (this.collides(bullet.position, entity => entity.id !== bullet.id)) {
        delete this.bullets[i];
        deleted = true;
      }
    }

    if (deleted) {
      this.bullets = this.bullets.filter(bullet => !!bullet);
    }
  }

  static create(data) {
    return new World(
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
