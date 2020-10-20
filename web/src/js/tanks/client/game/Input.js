import * as Direction from '@Lib/tanks/lib/data/primitives/Direction.js';
import Point from '@Lib/tanks/lib/data/primitives/Point.js';

function positionToDirection(original, touch) {
  const dx = touch.pageX - original.x;
  const dy = touch.pageY - original.y;
  const adx = Math.abs(dx);
  const ady = Math.abs(dy);

  if (adx > ady && dx > 0) {
    return Direction.Direction.RIGHT;
  } else if (adx > ady && dx < 0) {
    return Direction.Direction.LEFT;
  } else if (ady > adx && dy > 0) {
    return Direction.Direction.DOWN;
  } else if (ady > adx && dy < 0) {
    return Direction.Direction.UP;
  }

  return null;
}

export default class Input {

  constructor() {
    this.movingTouch = null;
    this.movingPos = null;

    this.movingDirection = null;
    this.shooting = false;
  }

  keydown(event) {
    const direction = this.keyToDirection(event.code);
    if (direction !== null) {
      this.movingDirection = direction;
      event.preventDefault();
      return;
    }

    switch (event.code) {
      case 'Space':
      case 'KeyK':
        this.shooting = true;
        event.preventDefault();
        break;
    }
  }

  keyup(event) {
    switch (event.code) {
      case 'Space':
      case 'KeyK':
        this.shooting = false;
        event.preventDefault();
        return;
    }

    if (this.movingDirection === this.keyToDirection(event.code)) {
      this.movingDirection = false;
      event.preventDefault();
    }
  }

  handleTouches(touches) {
    let stillMoving = false;
    let stillShooting = false;
    for (let touch of touches) {
      if (touch.pageX < (window.innerWidth / 2) && this.movingTouch === null) {
        this.movingTouch = touch.identifier;
        this.movingPos = Point.create(touch.pageX, touch.pageY);
        stillMoving = true;
        continue;
      }

      if (this.movingTouch === touch.identifier) {
        stillMoving = true;
        const direction = positionToDirection(this.movingPos, touch);
        if (direction !== null) {
          this.moving = direction;
        }
      }

      if (touch.pageX > (window.innerWidth / 2)) {
        stillShooting = true;
      }
    }

    if (!stillMoving) {
      this.movingPos = null;
      this.movingTouch = null;
      this.movingDirection = null;
    }
    if (!stillShooting) {
      this.shooting = false;
    }
  }

  touchstart(event) {
    this.handleTouches(event.touches);
  }

  touchmove(event) {
    this.handleTouches(event.touches);
  }

  touchend(event) {
    this.handleTouches(event.touches);
  }

  touchcancel(event) {
    this.handleTouches(event.touches);
  }

  keyToDirection(keyCode) {
    switch (keyCode) {
      case 'ArrowUp':
      case 'KeyW':
        return Direction.Direction.UP;
      case 'ArrowDown':
      case 'KeyS':
        return Direction.Direction.DOWN;
      case 'ArrowLeft':
      case 'KeyA':
        return Direction.Direction.LEFT;
      case 'ArrowRight':
      case 'KeyD':
        return Direction.Direction.RIGHT;
    }

    return null;
  }

}
