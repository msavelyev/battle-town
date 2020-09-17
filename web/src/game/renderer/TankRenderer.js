import Direction from '../../../../lib/src/data/Direction.js';
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
    this.world.tanks.forEach(tank => this.updateTank(this.ctx, event, tank));
  }

  updateTank(ctx, event, tank) {
    this.drawTank(ctx, tank);
  }

  drawTank(ctx, tank) {
    const x = tank.position.x;
    const y = tank.position.y;
    const size = tank.size * this.size.unit;

    ctx.fillStyle = tank.id === this.id ? 'yellow' : 'red';
    ctx.setTransform(1, 0, 0, 1, x * this.size.unit, y * this.size.unit);
    ctx.transform(1, 0, 0, 1, size / 2, size / 2);

    ctx.textAlign = 'center';
    ctx.font = `${this.size.unit * 0.75}px Helvetica`;
    ctx.fillText(tank.name, 0, - this.size.unit * 1.25);
    ctx.textAlign = 'left';

    ctx.rotate(Direction.toRad(tank.direction));
    ctx.transform(1, 0, 0, 1, -size / 2, -size / 2);
    ctx.beginPath();

    Sprites.draw(ctx, this.sprites.tank, 0, 0, size, size);

    const tmp = ctx.globalCompositeOperation;
    ctx.globalCompositeOperation = 'multiply';
    ctx.fillRect(0, 0, size, size);
    ctx.globalCompositeOperation = tmp;

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
