import Fps from '../../../../lib/src/util/Fps.js';
import {renderText} from './text.js';

export default class FpsRenderer {

  constructor(ctx, position) {
    this.ctx = ctx;
    this.position = position;

    this.fps = new Fps();
  }

  update() {
    this.fps.update();

    renderText(this.ctx, 'fps: ' + this.fps.fps, this.position.x, this.position.y);
  }

}
