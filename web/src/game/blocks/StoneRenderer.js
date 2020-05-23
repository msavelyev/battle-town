import BlockType from '../../../../lib/src/BlockType.js';
import BlockRenderer from './BlockRenderer.js';

export default class StoneRenderer extends BlockRenderer {

  constructor(world) {
    super(world, BlockType.STONE, 'gray');
  }

}
