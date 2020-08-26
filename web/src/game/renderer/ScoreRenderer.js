
export default class ScoreRenderer {

  constructor(ctx, world) {
    this.ctx = ctx;
    this.world = world;
  }

  update() {
    this.ctx.font = '15px monospace';

    this.ctx.lineWidth = 5;
    this.ctx.textAlign = 'right';

    let offset = 0;

    for (let [id, score] of Object.entries(this.world.score)) {
      const text = `${id.substr(0, 8)}: ${score}`;

      this.ctx.strokeStyle = 'white';
      this.ctx.strokeText(text, this.world.width - 5, 12 + offset);
      this.ctx.fillStyle = 'black';
      this.ctx.fillText(text, this.world.width - 5, 12 + offset);

      offset += 15;
    }

    this.ctx.textAlign = 'left';
    this.ctx.lineWidth = 1;
  }

}
