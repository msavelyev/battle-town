import {BlockType} from '../../../../../lib/src/data/entity/BlockType.js';
import {SPRITES} from '../sprites.js';
import blockRenderer from './blockRenderer.js';

export default function(ctx, game, sprites) {
  return blockRenderer(ctx, game, BlockType.STONE, sprites, SPRITES.STONE);
}
