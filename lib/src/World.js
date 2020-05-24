import Block from './Block.js';
import Tank from './Tank.js';

export default class World {

  constructor(width, height, blocks, tanks) {
    this.width = width;
    this.height = height;
    this.blocks = blocks;
    this.tanks = tanks;
  }

  addTank(tank) {
    this.tanks.push(tank);
  }

  removeTank(id) {
    this.tanks = this.tanks.filter(tank => tank.id !== id);
  }

  moveTank(id, direction) {
    const tank = this.tanks.find(tank => tank.id === id);
    const newPosition = tank.newPosition(direction);

    if (!this.collides(newPosition)) {
      tank.move(direction);
    } else {
      tank.direction = direction;
    }
  }

  collides(position) {
    for (let block of this.blocks) {
      if (block.collides(position)) {
        return true;
      }
    }

    for (let tank of this.tanks) {
      if (tank.collides(position)) {
        return true;
      }
    }

    return false;
  }

  static create(data) {
    return new World(
      data.width,
      data.height,
      data.blocks.map(block => Block.create(block)),
      data.tanks.map(tank => Tank.create(tank))
    )
  }

  static get BLOCK_SIZE() {
    return 32;
  }

}
