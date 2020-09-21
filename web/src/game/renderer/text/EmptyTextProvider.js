import TextRenderProvider from './TextRenderProvider.js';

export default class EmptyTextProvider extends TextRenderProvider {

  update() {
    return '';
  }

}
