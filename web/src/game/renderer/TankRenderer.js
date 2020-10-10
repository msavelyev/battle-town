import {BlockType} from '../../../../lib/src/data/entity/BlockType.js';
import * as Entity from '../../../../lib/src/data/entity/Entity.js';
import {EntityState} from '../../../../lib/src/data/entity/EntityState.js';
import * as Direction from '../../../../lib/src/data/primitives/Direction.js';
import * as World from '../../../../lib/src/data/World.js';
import {SETTINGS} from '../../../../lib/src/util/dotenv.js';
import * as sprites from './sprites.js';
import {SPRITES} from './sprites.js';

export default class TankRenderer {

  constructor(ctx, game, sprites) {
    this.ctx = ctx;
    this.game = game;
    this.sprites = sprites;
  }

  update(event) {
    for (let tank of this.game.match.world.tanks) {
      if (tank.state === EntityState.DEAD) {
        continue;
      }
      this.drawTank(this.ctx, event, tank);
    }
  }

  inJungle(tank) {
    for (let block of World.findBlocksByType(this.game.match.world, BlockType.JUNGLE)) {
      if (Entity.collides(block, tank)) {
        return true;
      }
    }

    return false;
  }

  drawTank(ctx, event, tank) {
    const gameSize = this.game.size;
    const x = tank.position.x;
    const y = tank.position.y;
    const size = tank.size * gameSize.unit;

    if (tank.state === EntityState.REVIVING) {
      ctx.globalAlpha = 0.5;
    }

    let draw = true;
    if (tank.state === EntityState.REVIVING) {
      if (Math.ceil(event.tick / 10) % 2 !== 0) {
        draw = false;
      }
    }

    ctx.fillStyle = tank.id === this.game.id ? 'yellow' : 'red';
    ctx.setTransform(1, 0, 0, 1, x * gameSize.unit, y * gameSize.unit);
    ctx.transform(1, 0, 0, 1, size / 2, size / 2);

    ctx.font = `${gameSize.unit * 1.5}px Helvetica`;
    ctx.textAlign = 'center';
    if (!this.inJungle(tank)) {
      ctx.fillText(tank.name, 0, -gameSize.unit * 2.5);
    }

    if (SETTINGS.DEBUG_RENDER) {
      ctx.fillText(`(${x}; ${y})`, 0, gameSize.unit * 4);
    }

    ctx.textAlign = 'left';

    ctx.rotate(Direction.toRad(tank.direction));
    ctx.transform(1, 0, 0, 1, -size / 2, -size / 2);
    ctx.beginPath();

    if (draw) {
      sprites.draw(ctx, event.tick, this.sprites[gameSize.unit][SPRITES.TANK_STATIC], 0, 0, size, size);

      const tmp = ctx.globalCompositeOperation;
      ctx.globalCompositeOperation = 'multiply';
      ctx.fillRect(0, 0, size, size);
      ctx.globalCompositeOperation = tmp;
    }

    ctx.globalAlpha = 1;

    if (SETTINGS.DEBUG_RENDER) {
      ctx.strokeStyle = 'cyan';
      ctx.strokeRect(
        0,
        0,
        size,
        size
      );
    }

    ctx.resetTransform();
  }

}
