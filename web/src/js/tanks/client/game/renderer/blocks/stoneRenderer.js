import BlockType from 'Lib/tanks/lib/data/entity/BlockType.js';
import {SPRITES} from 'Client/tanks/client/game/renderer/sprites.js';
import blockRenderer from 'Client/tanks/client/game/renderer/blocks/blockRenderer.js';

export default function(ctx, game, sprites) {
  return blockRenderer(ctx, game, BlockType.STONE, sprites, SPRITES.STONE);
}
