import Fps from '../../../../../lib/src/util/Fps.js';
import TextRenderProvider from './TextRenderProvider.js';

export default class FpsTextProvider extends TextRenderProvider {

  constructor() {
    super();

    this.fps = new Fps();
  }

  update() {
    this.fps.update();

    return 'fps: ' + this.fps.fps;
  }

}
