import Direction from '../../../../../lib/src/data/Direction.js';
import {renderText} from '../text.js';

export default class TextRenderer {

  constructor(ctx, position, size, direction, textProviders) {
    this.ctx = ctx;
    this.position = position;
    this.size = size;
    this.direction = direction;
    this.textProviders = textProviders;
  }

  update(ctx, event) {
    const pos = this.position(this.size);

    let offset = 0;

    for (let provider of this.textProviders) {
      let textResult = provider.update(ctx, event);
      if (textResult === null) {
        continue;
      }

      if (!(textResult instanceof Array)) {
        textResult = [textResult];
      }

      for (const text of textResult) {
        renderText(
          this.ctx,
          text,
          pos.x,
          this.calcY(pos.y, offset),
          this.size.unit,
          this.baseline()
        );
        offset += this.size.unit;
      }
    }
  }

  baseline() {
    if (this.direction === Direction.UP) {
      return { baseline: 'bottom' };
    } else if (this.direction === Direction.DOWN) {
      return { baseline: 'top' };
    } else {
      throw new Error('Unknown text render direction ' + this.direction);
    }
  }

  calcY(y, offset) {
    if (this.direction === Direction.UP) {
      return y - offset;
    } else if (this.direction === Direction.DOWN) {
      return y + offset;
    } else {
      throw new Error('Unknown text render direction ' + this.direction);
    }
  }

}