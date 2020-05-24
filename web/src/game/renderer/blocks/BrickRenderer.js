import BlockType from '../../../../../lib/src/BlockType.js';
import BlockRenderer from './BlockRenderer.js';

export default class BrickRenderer extends BlockRenderer {

  constructor(world) {
    super(world, BlockType.BRICK, 'brown');
  }

}
