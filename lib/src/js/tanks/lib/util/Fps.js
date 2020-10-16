
function fps() {
  return {
    currentFrames: 0,
    fps: 0,
    time: new Date().getTime(),
  }
}
module.exports.fps = fps;

function update(fps) {
  let currentTime = new Date().getTime();
  if ((currentTime - fps.time) < 1000) {
    fps.currentFrames += 1;
  } else {
    fps.time = currentTime;
    fps.fps = fps.currentFrames;
    fps.currentFrames = 0;
  }
}
module.exports.update = update;
