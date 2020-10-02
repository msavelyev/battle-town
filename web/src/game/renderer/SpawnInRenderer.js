import {DEAD_TICKS} from '../../../../lib/src/data/Entity.js';
import { EntityState } from '../../../../lib/src/data/EntityState.js';
import * as World from '../../../../lib/src/data/World.js';
import * as Ticker from '../../../../lib/src/Ticker.js';
import {renderText} from './text.js';

export default class SpawnInRenderer {

  constructor(ctx, match, id, position, size) {
    this.ctx = ctx;
    this.match = match;
    this.id = id;
    this.position = position;
    this.size = size;
  }

  update() {
    const tank = World.findTank(this.match.world, this.id);

    if (tank.state !== EntityState.DEAD) {
      return;
    }

    const text = this.createText(tank);

    const pos = this.position(this.size);
    renderText(this.ctx, text, pos.x, pos.y, this.size.unit * 4, {
      center: true,
      stroke: true,
      bg: 'rgba(0, 0, 0, 0.8)'
    });
  }

  createText(tank) {
    const tick = this.match.tick;
    const spawnOnTick = tank.stateSince + DEAD_TICKS;
    const countdown = Ticker.countdown(tick, spawnOnTick);

    return 'Respawn in: ' + countdown;
  }

}
