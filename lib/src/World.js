export default class World {

  constructor(width, height) {
    this.width = width;
    this.height = height;

    this.tanks = []
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

}
