import userStorage from '../userStorage.js';
import api from '../api.js';
import Scene from './Scene.js';
import analytics from '../../../../lib/src/util/analytics.js';

const BASIC_TEXT = 'Loading';

export default class Loading extends Scene {

  constructor(overlay) {
    super();
    this.overlay = overlay;

    this.dots = 0;
    this.interval = null;
  }

  setup() {
    analytics.log('LOADING_SETUP');

    this.overlay.innerHTML = `
      <style>
        .loading__container {
            flex: 1;
            align-items: center;
            justify-content: center;
            display: flex;
        }
        h1 {
            color: white;
            font-family: Helvetica, sans-serif;
            font-size: 7vh;
            text-align: center;
        }
      </style>
      <div class="loading__container">
        <h1 id="loading__text">${BASIC_TEXT}</h1>
      </div>
    `;

    const text = document.getElementById('loading__text');
    this.interval = setInterval(this.updateText(text), 500);

    userStorage.get()
      .then(user => {
        analytics.setUserId(user.id);
        return user;
      })
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

      text.innerText = BASIC_TEXT + '.'.repeat(this.dots);
    };
  }

  teardown() {
    this.overlay.innerHTML = '';

    clearInterval(this.interval);
    this.interval = null;
    this.dots = 0;
  }

}
