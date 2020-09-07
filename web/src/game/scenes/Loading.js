import userStorage from '../userStorage.js';
import api from '../api.js';
import Scene from './Scene.js';

export default class Loading extends Scene {

  constructor(overlay) {
    super();
    this.overlay = overlay;
    this.interval = null;
    this.dots = 0;
    this.basicText = 'Loading';
  }

  setup() {
    this.overlay.innerHTML = `
      <style>
        h1 {
            color: white;
            font-family: Helvetica, sans-serif;
            font-size: 300%; 
        }
      </style>
      <h1 id="loading__text">${this.basicText}</h1>
    `;

    const text = document.getElementById('loading__text');
    this.interval = setInterval(this.updateText(text), 500);

    userStorage.get()
      .then(user => {
        return api.leaderboard(user.id)
          .then(top => {
            return {top, user};
          });
      })
      .then(data => this.onFinishCb(null, data))
      .catch(err => this.onFinishCb(err));
  }

  updateText(text) {
    return () => {
      this.dots++;
      if (this.dots > 3) {
        this.dots = 0;
      }

      text.innerText = this.basicText + '.'.repeat(this.dots);
    };
  }

  teardown() {
    clearInterval(this.interval);
    this.overlay.innerHTML = '';
  }

}
