import Scene from './Scene.js';

export default class Matchmaking extends Scene {

  constructor(overlay) {
    super();
    this.overlay = overlay;
  }

  setup(user) {
    this.overlay.innerHTML = `
      <h1 style="color: white">Matchmaking screen</h1>
      <pre style="color: white">${JSON.stringify(user, null, 4)}</pre>
    `;
  }

  teardown() {

  }

}
