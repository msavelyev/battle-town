
export default class Scenes {

  constructor(scenes) {
    this.scenes = scenes;
    this.sceneIdx = 0;
    this.scene = null;

  }

  start() {
    this.setupScene({});
  }

  setupScene(data) {
    this.scene = this.scenes[this.sceneIdx];
    this.scene.onFinish(this.onFinish.bind(this));
    this.scene.setup(data);
  }

  onFinish(err, result) {
    this.scene.teardown();

    if (err) {
      alert(`
        Something went really wrong.
        Please contact michael.savelyev@gmail.com if the problem persists.
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
