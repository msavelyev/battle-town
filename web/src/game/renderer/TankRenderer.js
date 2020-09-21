import BlockType from '../../../../lib/src/data/BlockType.js';
import Direction from '../../../../lib/src/data/Direction.js';
import Entity from '../../../../lib/src/data/Entity.js';
import EntityState from '../../../../lib/src/data/EntityState.js';
import World from '../../../../lib/src/data/World.js';
import {SETTINGS} from '../../../../lib/src/util/dotenv.js';
import Sprites from './Sprites.js';

export default class TankRenderer {

  constructor(ctx, id, world, sprites, size) {
    this.ctx = ctx;
    this.id = id;
    this.world = world;
    this.sprites = sprites;
    this.size = size;
  }

  update(event) {
    for (let tank of this.world.tanks) {
      if (tank.state === EntityState.DEAD) {
        continue;
      }
      this.drawTank(this.ctx, event, tank);
    }
  }

  inJungle(tank) {
    for (let block of World.findBlocksByType(this.world, BlockType.JUNGLE)) {
      if (Entity.collides(block, tank)) {
        return true;
      }
    }

    return false;
  }

  drawTank(ctx, event, tank) {
    const x = tank.position.x;
    const y = tank.position.y;
    const size = tank.size * this.size.unit;

    if (tank.state === EntityState.REVIVING) {
      ctx.globalAlpha = 0.5;
    }

    let draw = true;
    if (tank.state === EntityState.REVIVING) {
      if (Math.ceil(event.tick / 10) % 2 !== 0) {
        draw = false;
      }
    }

    ctx.fillStyle = tank.id === this.id ? 'yellow' : 'red';
    ctx.setTransform(1, 0, 0, 1, x * this.size.unit, y * this.size.unit);
    ctx.transform(1, 0, 0, 1, size / 2, size / 2);

    if (!this.inJungle(tank)) {
      ctx.textAlign = 'center';
      ctx.font = `${this.size.unit * 0.75}px Helvetica`;
      ctx.fillText(tank.name, 0, -this.size.unit * 1.25);
      ctx.textAlign = 'left';
    }

    ctx.rotate(Direction.toRad(tank.direction));
    ctx.transform(1, 0, 0, 1, -size / 2, -size / 2);
    ctx.beginPath();

    if (draw) {
      Sprites.draw(ctx, this.sprites.tank, 0, 0, size, size);

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
