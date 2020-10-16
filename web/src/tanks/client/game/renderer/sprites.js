import {chooseFrame} from '../../../../../../lib/src/tanks/lib/Ticker.js';
import {copy, freeze} from '../../../../../../lib/src/tanks/lib/util/immutable.js';

export const SPRITES = freeze({
  JUNGLE: 'jungle',
  WATER: 'water',
  BRICK_TL: 'brick-tl',
  BRICK_TR: 'brick-tr',
  BRICK_BL: 'brick-bl',
  BRICK_BR: 'brick-br',
  STONE: 'stone',
  BULLET: 'bullet',
  TANK_MOVING: 'tank-moving',
  TANK_STATIC: 'tank-static',
  EXPLOSION: 'explosion',
});

export function configure(spritesheet) {
  const result = {};

  for (const unitSize of Object.keys(spritesheet)) {
    const scaledSprites = spritesheet[unitSize];

    result[unitSize] = {};

    for (let spriteId of Object.keys(SPRITES)) {
      const spriteName = SPRITES[spriteId];
      const conf = scaledSprites.sheet[spriteName];
      if (!conf) {
        throw new Error(`Sprite ${spriteName} isn't configured properly`);
      }

      result[unitSize][spriteName] = copy(conf, {
        img: scaledSprites.img,
        name: spriteName,
        loop: conf.loop || false,
      });
    }

  }

  return freeze(result);
}

export function draw(ctx, tick, conf, x, y, w, h, startTick=0) {
  const frames = conf.frames;
  const frameIdx = chooseFrame(tick, frames.length, conf.frameLength, startTick, conf.loop);

  if (frameIdx < 0) {
    return;
  }

  const frame = frames[frameIdx];

  ctx.drawImage(conf.img, frame[0], frame[1], frame[2], frame[3], x, y, w, h);
}
