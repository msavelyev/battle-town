function s(img, x, y, w, h) {
  return { img, x, y, w, h };
}

export default class Sprites {
  constructor(img) {
    this.tank = s(img, 0, 32, 32, 32);
    this.brick = s(img, 80, 16, 16, 16);
    this.stone = s(img, 80, 0, 16, 16);
    this.jungle = s(img, 96, 0, 16, 16);
    this.water1 = s(img, 0, 16, 16, 16);
    this.water2 = s(img, 16, 16, 16, 16);
    this.bullet = s(img, 32, 16, 8, 8);
    this.explosion1 = s(img, 0, 64, 32, 32);
    this.explosion2 = s(img, 32, 64, 32, 32);
    this.explosion3 = s(img, 64, 64, 32, 32);
  }

  static draw(ctx, conf, x, y, w, h) {
    ctx.drawImage(conf.img, conf.x, conf.y, conf.w, conf.h, x, y, w, h);
  }

}
