import BlockType from '../../../../lib/src/BlockType.js';
import BlockRenderer from './BlockRenderer.js';

export default class WaterRenderer extends BlockRenderer{

  constructor(world) {
    super(world, BlockType.WATER, 'blue');
  }

}
