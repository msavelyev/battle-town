
export default class Scenes {

  constructor(scenes) {
    this.scenes = scenes;
    this.sceneIdx = 0;
    this.scene = null;

  }

  start(sceneName, data) {
    this.sceneIdx = this.scenes.findIndex(scene => scene.constructor === sceneName);

    this.setupScene(data);
  }

  setupScene(data) {
    if (this.sceneIdx >= this.scenes.length) {
      this.sceneIdx = 0;
    }

    this.scene = this.scenes[this.sceneIdx];
    this.scene.onFinish(this.onFinish.bind(this));
    console.log('setting up scene', this.scene.constructor.name);
    this.scene.setup(data);
  }

  onFinish(err, result) {
    this.scene.teardown();

    if (err) {
      alert(`
        Something went really wrong.
        Please contact misha@tsbaw.com if the problem persists.
        ---------------------------
        Error:
        ${err}
      `);
      console.log(err);
      return;
    }

    this.sceneIdx++;
    this.setupScene(result);
  }

}
