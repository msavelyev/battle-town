function s(img, x, y, w, h) {
  return { img, x, y, w, h };
}

const UNIT_SIZE = 32;

export default class Sprites {
  constructor(img) {
    this.tank = s(img, 0, UNIT_SIZE * 2, UNIT_SIZE * 2, UNIT_SIZE * 2);
    this.brick = s(img, UNIT_SIZE, 0, UNIT_SIZE, UNIT_SIZE);
    this.brick_tl = s(img, UNIT_SIZE, 0, UNIT_SIZE / 2, UNIT_SIZE / 2);
    this.brick_tr = s(img, UNIT_SIZE + UNIT_SIZE / 2, 0, UNIT_SIZE / 2, UNIT_SIZE / 2);
    this.brick_bl = s(img, UNIT_SIZE, UNIT_SIZE / 2, UNIT_SIZE / 2, UNIT_SIZE / 2);
    this.brick_br = s(img, UNIT_SIZE + UNIT_SIZE / 2, UNIT_SIZE / 2, UNIT_SIZE / 2, UNIT_SIZE / 2);
    this.stone = s(img, UNIT_SIZE * 5, 0, UNIT_SIZE, UNIT_SIZE);
    this.jungle = s(img, UNIT_SIZE * 6, 0, UNIT_SIZE, UNIT_SIZE);
    this.water1 = s(img, 0, UNIT_SIZE, UNIT_SIZE, UNIT_SIZE);
    this.water2 = s(img, UNIT_SIZE, UNIT_SIZE, UNIT_SIZE, UNIT_SIZE);
    this.bullet = s(img, UNIT_SIZE * 2, UNIT_SIZE, UNIT_SIZE / 2, UNIT_SIZE / 2);
    this.explosion1 = s(img, 0, UNIT_SIZE * 4, UNIT_SIZE * 2, UNIT_SIZE * 2);
    this.explosion2 = s(img, UNIT_SIZE * 2, UNIT_SIZE * 4, UNIT_SIZE * 2, UNIT_SIZE * 2);
    this.explosion3 = s(img, UNIT_SIZE * 4, UNIT_SIZE * 4, UNIT_SIZE * 2, UNIT_SIZE * 2);
  }

  static draw(ctx, conf, x, y, w, h) {
    ctx.drawImage(conf.img, conf.x, conf.y, conf.w, conf.h, x, y, w, h);
  }

}
