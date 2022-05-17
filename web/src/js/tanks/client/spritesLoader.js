import * as async from 'Lib/tanks/lib/util/async.js';
import {createSpriteSheet} from 'Client/tanks/client/assets/free-sprites.js';
import sprites1x from 'Client/tanks/client/assets/free-sprites.png';
import sprites2x from 'Client/tanks/client/assets/free-sprites-2x.png';
import sprites4x from 'Client/tanks/client/assets/free-sprites-4x.png';

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
    const imgOnLoad = async.createCb();
    const image = createImage(src, imgOnLoad);

    callbacks.push(imgOnLoad);

    result[unitSize] = {
      img: image,
      sheet: createSpriteSheet(unitSize)
    };
  }

  async.onAllReady(callbacks, () => {
    cb(result);
  });
}
