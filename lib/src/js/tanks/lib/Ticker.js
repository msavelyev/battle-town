const increaseTick = require('@Lib/tanks/lib/util/increaseTick.js');

const FPS = 60;
module.exports.FPS = FPS;

const FRAME_TIME = Math.ceil(1000 / FPS);
module.exports.FRAME_TIME = FRAME_TIME;

function create(setInterval, timeFunc) {
  return {
    scene: null,
    lastFrameTime: 0,
    stopped: false,
    setInterval: setInterval,
    timeFunc: timeFunc,
    tick: 0,
  };
}
module.exports.create = create;

function update(ticker) {
  if (ticker.stopped) {
    return;
  }

  const time = ticker.timeFunc();
  const delta = time - ticker.lastFrameTime;

  increaseTickNumber(ticker);

  ticker.lastFrameTime = time;
  ticker.scene.update({ delta, time, tick: ticker.tick });
}
module.exports.update = update;

function increaseTickNumber(ticker) {
  increaseTick(ticker.tick, val => ticker.tick = val);
}
module.exports.increaseTickNumber = increaseTickNumber;

function start(ticker, scene) {
  ticker.scene = scene;
  ticker.setInterval(update.bind(null, ticker), FRAME_TIME);
}
module.exports.start = start;

function stop(ticker) {
  ticker.stopped = true;
}
module.exports.stop = stop;

function countdown(currentTick, nextTick) {
  const diff = nextTick - currentTick;
  return Math.ceil(diff / FPS);
}
module.exports.countdown = countdown;

function chooseFrame(tick, frames, frameLengthInTicks, startTick, loop) {
  if (frames === 1) {
    return 0;
  }

  const frameNumber = Math.ceil((tick - startTick) / frameLengthInTicks);
  if (loop) {
    return frameNumber % frames;
  } else {
    return frameNumber < frames ? frameNumber : -1;
  }
}
module.exports.chooseFrame = chooseFrame;
