import {degToRad} from '../../../../lib/src/data/primitives/Direction.js';
import { EntityState } from '../../../../lib/src/data/entity/EntityState.js';
import * as World from '../../../../lib/src/data/World.js';
import helper from './helper.js';

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
    const position = helper.offset(tank.position, this.game.ownPosition());
    const x = position.x;
    const y = position.y;
    const size = tank.size * gameSize.unit;

    ctx.setTransform(1, 0, 0, 1, x * gameSize.unit, y * gameSize.unit);
    ctx.transform(1, 0, 0, 1, size / 2, size / 2);

    ctx.rotate(degToRad((event.tick - tank.stateSince) * 1.5));

    ctx.strokeStyle = '#ff0';
    ctx.lineWidth = gameSize.unit / 2;

    const n = gameSize.unit * Math.sin(event.tick / 10);

    for (let i = 0; i < 4; i++) {
      ctx.moveTo(-(size * 2) + n, 0);
      ctx.lineTo(-gameSize.unit * 3 + n, 0);
      ctx.stroke();

      ctx.moveTo(-gameSize.unit * 3 - gameSize.unit * 2 + n, -gameSize.unit / 2);
      ctx.lineTo(-gameSize.unit * 3 + n, 0);
      ctx.stroke();

      ctx.moveTo(-gameSize.unit * 3 - gameSize.unit * 2 + n, +gameSize.unit / 2);
      ctx.lineTo(-gameSize.unit * 3 + n, 0);
      ctx.stroke();

      ctx.rotate(degToRad(90));
    }

    ctx.lineWidth = 1;

    ctx.resetTransform();

  }

}
