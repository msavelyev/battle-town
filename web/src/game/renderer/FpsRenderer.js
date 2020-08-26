import Fps from '../../../../lib/src/util/Fps.js';

export default class FpsRenderer {

  constructor(ctx) {
    this.ctx = ctx;

    this.fps = new Fps();
  }

  update() {
    this.fps.update();

    const text = 'fps: ' + this.fps.get();

    this.ctx.font = '15px monospace';

    this.ctx.lineWidth = 5;
    this.ctx.strokeStyle = 'white';
    this.ctx.strokeText(text, 5, 12);
    this.ctx.fillStyle = 'black';
    this.ctx.fillText(text, 5, 12);

    this.ctx.lineWidth = 1;
  }

}
