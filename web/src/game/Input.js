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
      case 'KeyK':
        this.game.shoot();
        break;
    }
  }

  keyup(event) {
    if (!this.game.moving) {
      return;
    }

    if (this.game.direction !== this.keyToDirection(event.code)) {
      return;
    }

    this.game.stopMoving();
  }

  keyToDirection(keyCode) {
    switch (keyCode) {
      case 'ArrowUp':
      case 'KeyW':
        return Direction.UP;
      case 'ArrowDown':
      case 'KeyS':
        return Direction.DOWN;
      case 'ArrowLeft':
      case 'KeyA':
        return Direction.LEFT;
      case 'ArrowRight':
      case 'KeyD':
        return Direction.RIGHT;
    }

    return null;
  }

}
