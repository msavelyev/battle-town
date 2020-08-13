
export default class FpsRenderer {

  constructor(ctx) {
    this.ctx = ctx;

    this.currentFrames = 0;
    this.fps = 0;
    this.time = new Date().getTime();
  }

  update() {
    this.updateFps();

    const text = 'fps: ' + this.fps;

    this.ctx.font = '15px monospace';

    this.ctx.lineWidth = 5;
    this.ctx.strokeStyle = 'white';
    this.ctx.strokeText(text, 5, 15);
    this.ctx.fillStyle = 'black';
    this.ctx.fillText(text, 5, 15);

    this.ctx.lineWidth = 1;
  }

  updateFps() {
    let currentTime = new Date().getTime();
    if ((currentTime - this.time) < 1000) {
      this.currentFrames += 1;
    } else {
      this.time = currentTime;
      this.fps = this.currentFrames;
      this.currentFrames = 0;
    }
  }

}
