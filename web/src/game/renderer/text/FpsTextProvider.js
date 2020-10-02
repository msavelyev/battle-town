import * as Fps from '../../../../../lib/src/util/Fps.js';
import TextRenderProvider from './TextRenderProvider.js';

export default class FpsTextProvider extends TextRenderProvider {

  constructor() {
    super();

    this.fps = Fps.fps();
  }

  update() {
    Fps.update(this.fps)

    return 'fps: ' + this.fps.fps;
  }

}
