
export default class Sprites {
  constructor(img) {
    createImageBitmap(img, 0, 32, 32, 32).then(img => {this.tank = img});
    createImageBitmap(img, 80, 16, 16, 16).then(img => {this.brick = img});
    createImageBitmap(img, 80, 0, 16, 16).then(img => {this.stone = img});
    createImageBitmap(img, 96, 0, 16, 16).then(img => {this.jungle = img});
    createImageBitmap(img, 0, 16, 16, 16).then(img => {this.water1 = img});
    createImageBitmap(img, 16, 16, 16, 16).then(img => {this.water2 = img});
    createImageBitmap(img, 32, 16, 8, 8).then(img => {this.bullet = img});
  }
}
