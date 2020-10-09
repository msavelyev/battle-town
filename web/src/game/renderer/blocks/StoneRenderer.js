import { BlockType } from '../../../../../lib/src/data/entity/BlockType.js';
import {SPRITES} from '../sprites.js';
import BlockRenderer from './BlockRenderer.js';

export default class StoneRenderer extends BlockRenderer {

  constructor(ctx, game, sprites) {
    super(ctx, game, BlockType.STONE, sprites, SPRITES.STONE);
  }

}
