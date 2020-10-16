import {DEAD_TICKS} from '../../../../../../lib/src/tanks/lib/data/entity/Entity.js';
import {EntityState} from '../../../../../../lib/src/tanks/lib/data/entity/EntityState.js';
import * as World from '../../../../../../lib/src/tanks/lib/data/World.js';
import * as Ticker from '../../../../../../lib/src/tanks/lib/Ticker.js';
import {renderText} from './text.js';

function createText(game, tank) {
  const tick = game.match.tick;
  const spawnOnTick = tank.stateSince + DEAD_TICKS;
  const countdown = Ticker.countdown(tick, spawnOnTick);

  return 'Respawn in: ' + countdown;
}


export default function (ctx, game, position) {
  return () => {
    const size = game.size;

    const tank = World.findTank(game.match.world, game.id);
    if (!tank) {
      return;
    }

    if (tank.state !== EntityState.DEAD) {
      return;
    }

    const text = createText(game, tank);

    const pos = position(size);
    renderText(ctx, text, pos.x, pos.y, size.unit * 8, {
      center: true,
      stroke: true,
      bg: 'rgba(0, 0, 0, 0.8)'
    });
  };
}

