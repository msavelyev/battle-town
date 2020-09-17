import log from '../../../../lib/src/util/log.js';
import Loading from './Loading.js';

export default class Scenes {

  constructor(scenes) {
    this.scenes = scenes;
    this.sceneIdx = 0;
    this.scene = null;

  }

  startDefault() {
    this.start(Loading, {});
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
    log.info('setting up scene', this.scene.constructor.name);
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
      log.error(err);

      this.startDefault();

      return;
    }

    this.sceneIdx++;
    this.setupScene(result);
  }

  resize(size) {
    if (this.scene) {
      this.scene.resize(size);
    }
  }

}
