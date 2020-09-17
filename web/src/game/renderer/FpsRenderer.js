import Fps from '../../../../lib/src/util/Fps.js';
import {renderText} from './text.js';

export default class FpsRenderer {

  constructor(ctx, position, size) {
    this.ctx = ctx;
    this.position = position;
    this.size = size;

    this.fps = new Fps();
  }

  update() {
    this.fps.update();

    const pos = this.position(this.size);
    renderText(this.ctx, 'fps: ' + this.fps.fps, pos.x, pos.y, this.size.unit);
  }

}
