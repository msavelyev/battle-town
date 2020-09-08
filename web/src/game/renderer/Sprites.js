
export default class Sprites {
  constructor(img) {
    this.img = img;
    this.imagesToLoad = 0;
  }

  init(cb) {
    this.createSprite(0, 32, 32, 32, 'tank', cb);
    this.createSprite(80, 16, 16, 16, 'brick', cb);
    this.createSprite(80, 0, 16, 16, 'stone', cb);
    this.createSprite(96, 0, 16, 16, 'jungle', cb);
    this.createSprite(0, 16, 16, 16, 'water1', cb);
    this.createSprite(16, 16, 16, 16, 'water2', cb);
    this.createSprite(32, 16, 8, 8, 'bullet', cb);
  }

  createSprite(sx, sy, sw, sh, name, cb) {
    this.imagesToLoad++;

    createImageBitmap(this.img, sx, sy, sw, sh)
      .then(img => {
        this.imagesToLoad--;
        this[name] = img;

        if (this.imagesToLoad === 0) {
          cb();
        }
      });
  }
}
