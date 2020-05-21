import Tank from "../../lib/src/Tank";
import TankRenderer from "./TankRenderer";
import Point from "../../lib/src/Point";
import Direction from "../../lib/src/Direction";

export default class Game {

  constructor(width, height) {
    this.width = width;
    this.height = height;

    this.tank = new Tank(new Point(0, 0));
    this.tankRenderer = new TankRenderer(this.tank);
  }

  update(canvas, event) {
    canvas.fillStyle = 'white';
    canvas.fillRect(0, 0, this.width, this.height);

    canvas.strokeStyle = 'black';
    canvas.strokeRect(0, 0, this.width, this.height);

    this.tankRenderer.update(canvas, event);
  }

  onkey(event) {
    switch (event.key) {
      case 'ArrowUp':
        this.tank.move(Direction.UP);
        break;
      case 'ArrowDown':
        this.tank.move(Direction.DOWN);
        break;
      case 'ArrowLeft':
        this.tank.move(Direction.LEFT);
        break;
      case 'ArrowRight':
        this.tank.move(Direction.RIGHT);
        break;
    }
  }

}
