import EntityState from '@Lib/tanks/lib/data/entity/EntityState.js';
import Direction from '@Lib/tanks/lib/data/primitives/Direction.js';
import World from '@Lib/tanks/lib/data/World.js';
import helper from '@Client/tanks/client/game/renderer/helper.js';

export default function(ctx, game) {
  return event => {
    const tank = World.findTank(game.match.world, game.id);
    if (!tank) {
      return;
    }

    if (tank.state !== EntityState.REVIVING) {
      return;
    }

    const gameSize = game.size;
    const position = helper.offset(tank.position, game.ownPosition());
    const x = position.x;
    const y = position.y;
    const size = tank.size * gameSize.unit;

    ctx.setTransform(1, 0, 0, 1, x * gameSize.unit, y * gameSize.unit);
    ctx.transform(1, 0, 0, 1, size / 2, size / 2);

    ctx.rotate(Direction.degToRad((event.tick - tank.stateSince) * 1.5));

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

      ctx.rotate(Direction.degToRad(90));
    }

    ctx.lineWidth = 1;

    ctx.resetTransform();
  };
}
