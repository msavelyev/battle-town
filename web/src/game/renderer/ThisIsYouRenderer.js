import {degToRad} from '../../../../lib/src/data/primitives/Direction.js';
import { EntityState } from '../../../../lib/src/data/entity/EntityState.js';
import * as World from '../../../../lib/src/data/World.js';

export default class ThisIsYouRenderer {

  constructor(ctx, world, id, size) {
    this.ctx = ctx;
    this.world = world;
    this.id = id;
    this.size = size;
  }

  update(event) {
    const tank = World.findTank(this.world, this.id);
    if (!tank) {
      return;
    }

    if (tank.state !== EntityState.REVIVING) {
      return;
    }

    const ctx = this.ctx;

    const x = tank.position.x;
    const y = tank.position.y;
    const size = tank.size * this.size.unit;

    ctx.setTransform(1, 0, 0, 1, x * this.size.unit, y * this.size.unit);
    ctx.transform(1, 0, 0, 1, size / 2, size / 2);

    ctx.rotate(degToRad((event.tick - tank.stateSince) * 1.5));

    ctx.strokeStyle = '#ff0';
    ctx.lineWidth = this.size.unit / 4;

    const n = this.size.unit * Math.sin(event.tick / 10) / 2;

    for (let i = 0; i < 4; i++) {
      ctx.moveTo(-(size * 2) + n, 0);
      ctx.lineTo(-this.size.unit * 1.5 + n, 0);
      ctx.stroke();

      ctx.moveTo(-this.size.unit * 1.5 - this.size.unit + n, -this.size.unit / 4);
      ctx.lineTo(-this.size.unit * 1.5 + n, 0);
      ctx.stroke();

      ctx.moveTo(-this.size.unit * 1.5 - this.size.unit + n, +this.size.unit / 4);
      ctx.lineTo(-this.size.unit * 1.5 + n, 0);
      ctx.stroke();

      ctx.rotate(degToRad(90));
    }

    ctx.lineWidth = 1;

    ctx.resetTransform();

  }

}
