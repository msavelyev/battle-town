import * as Direction from '../../../../../lib/src/data/primitives/Direction.js';
import {renderText} from '../text.js';

function baseline(direction) {
  if (direction === Direction.Direction.UP) {
    return { baseline: 'bottom' };
  } else if (direction === Direction.Direction.DOWN) {
    return { baseline: 'top' };
  } else {
    throw new Error('Unknown text render direction ' + direction);
  }
}

function calcY(direction, y, offset) {
  if (direction === Direction.Direction.UP) {
    return y - offset;
  } else if (direction === Direction.Direction.DOWN) {
    return y + offset;
  } else {
    throw new Error('Unknown text render direction ' + direction);
  }
}

export default function(ctx, position, size, direction, textProviders) {
  return (event) => {
    const pos = position(size);

    let offset = 0;

    for (let provider of textProviders) {
      let textResult = provider(ctx, event);
      if (textResult === null) {
        continue;
      }

      if (!(textResult instanceof Array)) {
        textResult = [textResult];
      }

      for (const text of textResult) {
        renderText(
          ctx,
          text,
          pos.x,
          calcY(direction, pos.y, offset),
          size.unit * 2,
          baseline(direction)
        );
        offset += size.unit * 2;
      }
    }
  };
}
