
export default class TankRenderer {

  constructor(tank) {
    this.tank = tank;
  }

  update(canvas, event) {
    canvas.fillStyle = 'green';
    canvas.fillRect(
      this.tank.position.x,
      this.tank.position.y,
      this.tank.size,
      this.tank.size
    );
  }

}
