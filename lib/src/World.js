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

  findTank(id) {
    return this.tanks.find(tank => tank.id === id);
  }

  static create(data) {
    return new World(
      data.width,
      data.height,
      data.blocks,
      data.tanks.map(tank => Tank.create(tank))
    )
  }

  static get BLOCK_SIZE() {
    return 32;
  }

}
