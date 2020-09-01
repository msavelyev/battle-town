import Direction from '../../../lib/src/Direction.js';
import TankMove from '../../../lib/src/TankMove.js';

export default class Input {

  constructor(game) {
    this.game = game;
  }

  keydown(event) {
    const direction = this.keyToDirection(event.code);
    if (direction !== null) {
      this.game.startMoving(direction);
      return;
    }

    switch (event.code) {
      case 'Space':
        this.game.shoot();
        break;
    }
  }

  keyup(event) {
    const tank = this.game.world.findTank(this.game.tank.id);

    if (!tank.direction.eq(this.keyToDirection(event.code))) {
      return;
    }

    this.game.onStopMoving(new TankMove(this.game.tank.id))
    this.game.client.stopMoving();
  }

  keyToDirection(keyCode) {
    switch (keyCode) {
      case 'ArrowUp':
        return Direction.UP;
      case 'ArrowDown':
        return Direction.DOWN;
      case 'ArrowLeft':
        return Direction.LEFT;
      case 'ArrowRight':
        return Direction.RIGHT;
    }

    return null;
  }

}
