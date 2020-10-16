import Fps from '@Lib/tanks/lib/util/Fps.js';

export default function() {
  const fps = Fps.fps();

  return () => {
    Fps.update(fps)

    return 'fps: ' + fps.fps;
  }
}
