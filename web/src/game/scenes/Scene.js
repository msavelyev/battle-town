
export default class Scene {

  onFinish(cb) {
    this.onFinishCb = cb;
  }

  setup() {
    throw new Error('Scene setup() should be overridden');
  }

  teardown() {
    throw new Error('Scene teardown() should be overridden');
  }

}
