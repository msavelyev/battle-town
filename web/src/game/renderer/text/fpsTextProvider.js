import * as Fps from '../../../../../lib/src/tanks/lib/util/Fps.js';

export default function() {
  const fps = Fps.fps();

  return () => {
    Fps.update(fps)

    return 'fps: ' + fps.fps;
  }
}
