import {BlockType} from '../../../../../lib/src/tanks/lib/data/entity/BlockType.js';
import {SPRITES} from '../sprites.js';
import blockRenderer from './blockRenderer.js';

export default function(ctx, game, sprites) {
  return blockRenderer(ctx, game, BlockType.WATER, sprites, SPRITES.WATER);
}
