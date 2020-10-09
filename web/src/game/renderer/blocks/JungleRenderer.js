import { BlockType } from '../../../../../lib/src/data/entity/BlockType.js';
import {SPRITES} from '../sprites.js';
import BlockRenderer from './BlockRenderer.js';

export default class JungleRenderer extends BlockRenderer {

  constructor(ctx, game, sprites) {
    super(ctx, game, BlockType.JUNGLE, sprites, SPRITES.JUNGLE);
  }

}
