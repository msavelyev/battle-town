
const img = new Image();

img.src = document.getElementById('sprites').href;

class Sprites {
  constructor(img) {
    this.sprites = img;

    createImageBitmap(img, 0, 32, 32, 32).then(img => {this.tank = img});
    createImageBitmap(img, 16, 0, 16, 16).then(img => {this.brick = img});
    createImageBitmap(img, 32, 0, 16, 16).then(img => {this.stone = img});
    createImageBitmap(img, 48, 0, 16, 16).then(img => {this.jungle = img});
    createImageBitmap(img, 0, 16, 16, 16).then(img => {this.water1 = img});
    createImageBitmap(img, 16, 16, 16, 16).then(img => {this.water2 = img});
    createImageBitmap(img, 32, 16, 8, 8).then(img => {this.bullet = img});
  }
}

const sprites = new Sprites(img);
export default sprites;
