import increaseTick from 'Lib/tanks/lib/util/increaseTick.js';

export const FPS = 60;

export const FRAME_TIME = Math.ceil(1000 / FPS);

export function create(setInterval, timeFunc) {
  return {
    scene: null,
    lastFrameTime: 0,
    stopped: false,
    setInterval: setInterval,
    timeFunc: timeFunc,
    tick: 0,
  };
}

export function update(ticker) {
  if (ticker.stopped) {
    return;
  }

  const time = ticker.timeFunc();
  const delta = time - ticker.lastFrameTime;

  increaseTickNumber(ticker);

  ticker.lastFrameTime = time;
  ticker.scene.update({ delta, time, tick: ticker.tick });
}

export function increaseTickNumber(ticker) {
  increaseTick(ticker.tick, val => ticker.tick = val);
}

export function start(ticker, scene) {
  ticker.scene = scene;
  ticker.setInterval(update.bind(null, ticker), FRAME_TIME);
}

export function stop(ticker) {
  ticker.stopped = true;
}

export function countdown(currentTick, nextTick) {
  const diff = nextTick - currentTick;
  return Math.ceil(diff / FPS);
}

export function chooseFrame(tick, frames, frameLengthInTicks, startTick, loop) {
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
