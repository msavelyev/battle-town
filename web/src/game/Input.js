import Direction from '../../../lib/src/Direction.js';

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
    const tank = this.game.world.findTank(this.game.id);

    if (tank.direction !== this.keyToDirection(event.code)) {
      return;
    }

    this.game.stopMoving();
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
