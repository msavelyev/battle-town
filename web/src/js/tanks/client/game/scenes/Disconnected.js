import Scene from 'Client/tanks/client/game/scenes/Scene.js';

import 'Client/tanks/client/game/scenes/Disconnected.css';

export default class Disconnected extends Scene {

  constructor(overlay) {
    super();
    this.overlay = overlay;

    this.timeout = null;
  }

  setup(data) {
    this.overlay.innerHTML = `
      <div class="disconnected__container">
        <h1>Match finished. Redirecting to main menu.</h1>
      </div>
    `;

    this.timeout = setTimeout(() => {
      this.onFinishCb(null);
    }, 1000);
  }

  teardown() {
    clearTimeout(this.timeout);
  }

}
