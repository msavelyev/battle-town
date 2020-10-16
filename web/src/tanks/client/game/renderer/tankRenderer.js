import {BlockType} from '../../../../../../lib/src/tanks/lib/data/entity/BlockType.js';
import * as Entity from '../../../../../../lib/src/tanks/lib/data/entity/Entity.js';
import {EntityState} from '../../../../../../lib/src/tanks/lib/data/entity/EntityState.js';
import * as Direction from '../../../../../../lib/src/tanks/lib/data/primitives/Direction.js';
import * as World from '../../../../../../lib/src/tanks/lib/data/World.js';
import {SETTINGS} from '../../../../../../lib/src/tanks/lib/util/dotenv.js';
import helper from './helper.js';
import * as sprites from './sprites.js';
import {SPRITES} from './sprites.js';

function inJungle(game, tank) {
  for (let block of World.findBlocksByType(game.match.world, BlockType.JUNGLE)) {
    if (Entity.collides(block, tank)) {
      return true;
    }
  }

  return false;
}

function drawTank(game, spritesConf, ctx, event, tank) {
  const gameSize = game.size;
  const position = helper.offset(tank.position, game.ownPosition());

  if (helper.outsideVisibleBoundaries(position)) {
    return;
  }

  const x = position.x;
  const y = position.y;
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

  ctx.fillStyle = tank.id === game.id ? 'yellow' : 'red';
  ctx.setTransform(1, 0, 0, 1, x * gameSize.unit, y * gameSize.unit);
  ctx.transform(1, 0, 0, 1, size / 2, size / 2);

  ctx.font = `${gameSize.unit * 1.5}px Helvetica`;
  ctx.textAlign = 'center';
  if (!inJungle(game, tank)) {
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
    sprites.draw(ctx, event.tick, spritesConf[gameSize.unit][SPRITES.TANK_STATIC], 0, 0, size, size);

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


export default function(ctx, game, spritesConf) {
  return event => {
    for (let tank of game.match.world.tanks) {
      if (tank.state === EntityState.DEAD) {
        continue;
      }
      drawTank(game, spritesConf, ctx, event, tank);
    }
  };
}
