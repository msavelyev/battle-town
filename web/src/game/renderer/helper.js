import Point from '../../../../lib/src/data/primitives/Point.js';
import level from '../../../../server/src/level/level.js';

const helper = {
  offset(point, center) {
    if (!center) {
      return point;
    }

    const midX = Math.round(level.WIDTH / 2);
    const midY = Math.round(level.HEIGHT / 2);

    return Point.create(
      midX + point.x - center.x,
      midY + point.y - center.y
    );
  },

  outsideVisibleBoundaries(point) {
    return point.x < 0 || point.y < 0 || point.x > level.WIDTH || point.y > level.HEIGHT;
  }
};

export default helper;
