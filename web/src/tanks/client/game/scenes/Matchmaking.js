import {convertToTime} from '../../../../../../lib/src/tanks/lib/util/time.js';
import Scene from './Scene.js';
import Client from '../proto/Client.js';
import SocketioClient from '../proto/SocketioClient.js';
import EventType from '../../../../../../lib/src/tanks/lib/proto/EventType.js';
import MessageType from '../../../../../../lib/src/tanks/lib/proto/MessageType.js';
import analytics from '../../../../../../lib/src/tanks/lib/util/analytics.js';

import './Matchmaking.css';

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

    this.client = Client.create(SocketioClient());
    Client.on(this.client, EventType.DISCONNECT, () => {
      this.onFinishCb('Server disconnected');
    });
    this.startTime = this.now();
    this.user = user;

    this.overlay.innerHTML = `
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

    Client.on(this.client, EventType.CONNECT, this.stepAuth.bind(this));
    Client.connect(this.client);
  }

  stepAuth() {
    this.setStatusText('Authorizing');

    Client.on(this.client, EventType.AUTH_ACK, this.stepLookingForMatch.bind(this));

    Client.sendEvent(this.client, EventType.AUTH, {
      id: this.user.id,
      token: this.user.token
    });
  }

  stepLookingForMatch() {
    this.setStatusText('Finding match');

    Client.on(this.client, EventType.MATCH_FOUND, this.stepSettingUp.bind(this));
  }

  stepSettingUp() {
    this.setStatusText('Match found, setting it up');

    Client.onMessage(this.client, MessageType.INIT, conf => {
      this.onFinishCb(null, {
        conf,
        client: this.client
      });
    });
  }

  updateTimer(timer) {
    return () => {
      const elapsed = this.now() - this.startTime;
      timer.innerText = convertToTime(elapsed);
    };
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
