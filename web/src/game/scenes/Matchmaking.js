import Scene from './Scene.js';
import Client from '../proto/Client.js';
import SocketioClient from '../proto/SocketioClient.js';
import EventType from '../../../../lib/src/proto/EventType.js';
import MessageType from '../../../../lib/src/proto/MessageType.js';

export default class Matchmaking extends Scene {

  constructor(overlay) {
    super();
    this.overlay = overlay;
    this.client = new Client(new SocketioClient());

    this.startTime = null;
    this.interval = null;
    this.status = null;
    this.user = null;
  }

  setup(user) {
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
        }
        
        h2 {
            margin-top: 10px;
            margin-bottom: 20px;
        }
        
        #matchmaking__status {
            color: #333;
        }
        
      </style>
      <div class="matchmaking__container">
        <h1>Finding an opponent for you</h1>
        <h2 id="matchmaking__timer">0:00</h2>
        <span id="matchmaking__status">status</span>
      </div>
    `;

    const timer = document.getElementById('matchmaking__timer');
    setInterval(this.updateTimer(timer), 1000);

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
    this.setStatusText('Setting match up');

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
  }

}
