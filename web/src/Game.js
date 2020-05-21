
export default class Game {

  constructor(canvas, width, height) {
    this.canvas = canvas;
    this.width = width;
    this.height = height;
  }

  update() {
    this.canvas.fillStyle = 'white';
    this.canvas.fillRect(0, 0, this.width, this.height);

    this.canvas.strokeStyle = 'black';
    this.canvas.strokeRect(0, 0, this.width, this.height);

    this.canvas.fillStyle = 'green';
    this.canvas.fillRect(0, 0, 50, 50);
  }

}
