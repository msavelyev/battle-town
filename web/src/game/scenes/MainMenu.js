import api from '../api.js';
import Scene from './Scene.js';
import analytics from '../../../../lib/src/tanks/lib/util/analytics.js';
import howto from '../../../public/howto.png';

import './MainMenu.css';

export default class MainMenu extends Scene {

  constructor(overlay) {
    super();
    this.overlay = overlay;

    this.onStart = null;
  }

  setup(data) {
    analytics.log('MAIN_MENU_SETUP');

    this.data = data;

    this.overlay.innerHTML = `
      <div class="mainMenu__container">
        <div class="mainMenu__row">
          <h1>Battle Town</h1>
        </div>
        <div class="mainMenu__row mainMenu__spacer">
        </div>
        <div class="mainMenu__row">
          <label class="mainMenu__label">Your name:</label>
          <input id="mainMenu__input" type="text" value="${data.user.name}" />         
        </div>
        <div class="mainMenu__row">
          <input id="mainMenu__start" type="submit" value="Start" />        
        </div>
      </div>
      
      <div class="mainMenu__leaderboard">
        <h4>Leaderboard</h4>
        ${this.leaderboard(data)}
      </div>

      <div class="mainMenu__howto">
        <h4>How to play</h4>

        <img src="${howto}" />
      </div>
    `;

    const nameInput = document.getElementById('mainMenu__input');
    const startButton = document.getElementById('mainMenu__start');

    this.onStart = this.start(nameInput, startButton, data);

    startButton.addEventListener('click', this.onStart);
    window.addEventListener('keydown', this.onStart);
  }

  start(nameInput, startButton, data) {
    return event => {
      if (event.type === 'keydown' && event.code !== 'Enter') {
        return;
      }

      analytics.log('MAIN_MENU_START');

      startButton.disabled = true;

      const newName = nameInput.value;
      const user = data.user;

      if (newName === user.name) {
        return this.onFinishCb(null, user);
      }

      api.updateName(user.id, user.token, newName)
        .then(result => {
          startButton.disabled = false;
          if (result.success) {
            return this.onFinishCb(null, result.user);
          } else {
            alert(`
            Couldn't change username:
            ${result.msg}
          `);
          }
        });

      event.preventDefault();
    };
  }

  leaderboard(data) {
    const leaderboard = data.top;
    const you = data.user;

    let content = '';

    let prevRank = 0;
    for (let item of leaderboard) {
      if (prevRank < (item.rank - 1)) {
        content += `
          <div class="mainMenu__leaderboard-item">
            <span class="mainMenu__leaderboard-item-left">...</span>
          </div>
        `;
      }

      content += `
        <div class="mainMenu__leaderboard-item ${item.name === you.name ? 'mainMenu__leaderboard-you' : ''}">
          <span class="mainMenu__leaderboard-item-left">${item.rank}. ${item.name}</span>
          <span class="mainMenu__leaderboard-item-right">${item.points}</span>
        </div>
      `;

      prevRank = item.rank;
    }

    return content;
  }

  teardown() {
    this.overlay.innerHTML = '';

    window.removeEventListener('keydown', this.onStart);

    this.onStart = null;
  }
}
