import {degToRad} from '../../../../lib/src/data/primitives/Direction.js';
import { EntityState } from '../../../../lib/src/data/entity/EntityState.js';
import * as World from '../../../../lib/src/data/World.js';

export default class ThisIsYouRenderer {

  constructor(ctx, game) {
    this.ctx = ctx;
    this.game = game;
  }

  update(event) {
    const tank = World.findTank(this.game.match.world, this.game.id);
    if (!tank) {
      return;
    }

    if (tank.state !== EntityState.REVIVING) {
      return;
    }

    const ctx = this.ctx;

    const gameSize = this.game.size;
    const x = tank.position.x;
    const y = tank.position.y;
    const size = tank.size * gameSize.unit;

    ctx.setTransform(1, 0, 0, 1, x * gameSize.unit, y * gameSize.unit);
    ctx.transform(1, 0, 0, 1, size / 2, size / 2);

    ctx.rotate(degToRad((event.tick - tank.stateSince) * 1.5));

    ctx.strokeStyle = '#ff0';
    ctx.lineWidth = gameSize.unit / 4;

    const n = gameSize.unit * Math.sin(event.tick / 10) / 2;

    for (let i = 0; i < 4; i++) {
      ctx.moveTo(-(size * 2) + n, 0);
      ctx.lineTo(-gameSize.unit * 1.5 + n, 0);
      ctx.stroke();

      ctx.moveTo(-gameSize.unit * 1.5 - gameSize.unit + n, -gameSize.unit / 4);
      ctx.lineTo(-gameSize.unit * 1.5 + n, 0);
      ctx.stroke();

      ctx.moveTo(-gameSize.unit * 1.5 - gameSize.unit + n, +gameSize.unit / 4);
      ctx.lineTo(-gameSize.unit * 1.5 + n, 0);
      ctx.stroke();

      ctx.rotate(degToRad(90));
    }

    ctx.lineWidth = 1;

    ctx.resetTransform();

  }

}
