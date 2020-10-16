
function createCb() {
  let cb;
  cb = function() {
    cb.ready = true;
    if (cb.onReady) {
      cb.onReady();
    }

  };
  cb.ready = false;

  return cb;

}
module.exports.createCb = createCb;

function onAllReady(callbacks, cb) {
  let counter = 0;
  for (const callback of callbacks) {
    if (callback.ready) {
      continue;
    }

    counter++;
    callback.onReady = () => {
      counter--;

      if (counter === 0) {
        cb();
      }
    };
  }

  if (counter === 0) {
    cb();
  }
}
module.exports.onAllReady = onAllReady;
