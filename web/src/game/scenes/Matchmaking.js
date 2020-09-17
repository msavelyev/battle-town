import Scene from './Scene.js';
import Client from '../proto/Client.js';
import SocketioClient from '../proto/SocketioClient.js';
import EventType from '../../../../lib/src/proto/EventType.js';
import MessageType from '../../../../lib/src/proto/MessageType.js';
import analytics from '../../../../lib/src/util/analytics.js';

export default class Matchmaking extends Scene {

  constructor(overlay) {
    super();
    this.overlay = overlay;

    this.client = null;
    this.startTime = null;
    this.interval = null;
    this.status = null;
    this.user = null;
  }

  setup(user) {
    analytics.log('MATCHMAKING_SETUP');

    this.client = new Client(new SocketioClient());
    this.client.on(EventType.DISCONNECT, () => {
      this.onFinishCb('Server disconnected');
    });
    this.startTime = this.now();
    this.user = user;

    this.overlay.innerHTML = `
      <style>
        .matchmaking__container {
            display: flex;
            color: white;
            flex-direction: column;
            font-family: Helvetica, sans-serif;
            text-align: center;
            align-items: center;
            flex-grow: 1;
            justify-content: center;
        }
        
        h1 {
            font-size: 5vh;
        }
        
        h2 {
            margin-top: 2vh;
            margin-bottom: 3vh;
            font-size: 3.5vh;
        }
        
        #matchmaking__status {
            color: #333;
            font-size: 2vh;
        }
        
      </style>
      <div class="matchmaking__container">
        <h1>Finding an opponent for you</h1>
        <h2 id="matchmaking__timer">0:00</h2>
        <span id="matchmaking__status">status</span>
      </div>
    `;

    const timer = document.getElementById('matchmaking__timer');
    this.interval = setInterval(this.updateTimer(timer), 1000);

    this.status = document.getElementById('matchmaking__status');
    this.stepConnect();
  }

  setStatusText(text) {
    this.status.innerText = `status: ${text}`;
  }

  stepConnect() {
    this.setStatusText('Connecting to servers');

    this.client.on(EventType.CONNECT, this.stepAuth.bind(this));
    this.client.connect();
  }

  stepAuth() {
    this.setStatusText('Authorizing');

    this.client.on(EventType.AUTH_ACK, this.stepLookingForMatch.bind(this));

    this.client.sendEvent(EventType.AUTH, {
      id: this.user.id,
      token: this.user.token
    });
  }

  stepLookingForMatch() {
    this.setStatusText('Finding match');

    this.client.on(EventType.MATCH_FOUND, this.stepSettingUp.bind(this));
  }

  stepSettingUp() {
    this.setStatusText('Match found, setting it up');

    this.client.onMessage(MessageType.INIT, conf => {
      this.onFinishCb(null, {
        conf,
        client: this.client
      });
    });
  }

  updateTimer(timer) {
    return () => {
      const elapsed = this.now() - this.startTime;
      const seconds = this.formatTwoDigits(elapsed % 60);
      const minutes = Math.floor(elapsed / 60);

      timer.innerText = `${minutes}:${seconds}`;
    };
  }

  formatTwoDigits(number) {
    if (number < 10) {
      return `0${number}`;
    } else {
      return `${number}`;
    }
  }

  now() {
    return Math.floor(new Date().getTime() / 1000);
  }

  teardown() {
    this.overlay.innerHTML = '';

    clearInterval(this.interval);

    this.interval = null;
    this.startTime = null;
    this.status = null;
    this.user = null;
  }

}
