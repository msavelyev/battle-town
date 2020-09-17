import Scene from './Scene.js';

export default class Disconnected extends Scene {

  constructor(overlay) {
    super();
    this.overlay = overlay;

    this.timeout = null;
  }

  setup(data) {
    this.overlay.innerHTML = `
      <style>
        .disconnected__container {
            color: white;
            font-family: Helvetica, sans-serif;
            display: flex;
            flex: 1;
            justify-content: center;
            align-items: center;
        }
      </style>
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
