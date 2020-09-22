import menuBg from '../../../public/menu-bg.png';
import api from '../api.js';
import Scene from './Scene.js';
import analytics from '../../../../lib/src/util/analytics.js';
import howto from '../../../public/howto.png';

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
      <style>
        .mainMenu__container {
            display: flex;
            flex-direction: column;
            font-family: Helvetica, serif;
            color: white;
            flex: 1;
            justify-content: center;
            background:
              linear-gradient(
               rgba(0, 0, 0, 0.7), 
               rgba(0, 0, 0, 0.7)
              ),
              url('${menuBg}') no-repeat;
            background-size: cover;
        }
        
        #mainMenu__start {
            margin-top: 2vh;
            padding: 0.5vh 2vh;
            font-size: 5vh;
        }
        
        .mainMenu__row {
            display: flex;
            justify-content: center;
        }
        
        #mainMenu__input {
            font-size: 3vh;
            padding: 0.7vh;
        }
        
        .mainMenu__label {
            color: white;
            margin-right: 2vh;
            font-size: 3vh;
            align-items: center;
            display: flex;
        }      
        
        h1, h3 {
            text-align: center;
        }
        
        h1 {
            font-size: 11vh;
            margin-top: 2vh;
        }
        
        h4 {
            text-align: center;
            font-size: 4vh;
            margin-bottom: 2vh;
        }
        
        .mainMenu__spacer {
            height: 15vh;
        }
        
        .mainMenu__howto {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 20vw;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            font-family: Helvetica, sans-serif;
            font-size: 2.5vh;
            padding: 2vh;
            margin: 1vh;
        }

        .mainMenu__howto img {
            width: 20vw;
        }

        .mainMenu__leaderboard {
            display: none;
            position: absolute;
            width: 17vw;
            top: 0;
            right: 0;
            
            color: white;
            font-family: Helvetica, sans-serif;
            font-size: 2.5vh;
            
            /*display: flex;*/
            flex-direction: column;
            
            background: rgba(90, 90, 90, 0.5);
            border-radius: 1vh;
            padding: 2vh;
            margin: 1vh;        
        }
        
        .mainMenu__leaderboard-item {
            display: flex;
            margin: 0.7vh;
        }
        
        .mainMenu__leaderboard-you {
            font-weight: bold;
            color: #090;
        }
        
        .mainMenu__leaderboard-item-left {
            flex-grow: 3;
        }
        
        .mainMenu__leaderboard-item-right {
            flex-grow: 1;
            text-align: right;
        }
        
      </style>

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
