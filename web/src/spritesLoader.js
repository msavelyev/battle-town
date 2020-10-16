
import {createCb, onAllReady} from '../../lib/src/tanks/lib/util/async.js';
import {createSpriteSheet} from '../public/free-sprites.js';
import sprites1x from '../public/free-sprites.png';
import sprites2x from '../public/free-sprites-2x.png';
import sprites4x from '../public/free-sprites-4x.png';

function createImage(src, cb) {
  const image = new Image();
  image.addEventListener('load', cb);
  image.src = src;
  return image;
}

export function loadSpriteSheets(cb) {
  const imgs = {
    4: sprites1x,
    8: sprites2x,
    16: sprites4x
  };

  const result = {};

  const callbacks = [];
  for (let unitSize of Object.keys(imgs)) {
    const src = imgs[unitSize];
    const imgOnLoad = createCb();
    const image = createImage(src, imgOnLoad);

    callbacks.push(imgOnLoad);

    result[unitSize] = {
      img: image,
      sheet: createSpriteSheet(unitSize)
    };
  }

  onAllReady(callbacks, () => {
    cb(result);
  });
}
