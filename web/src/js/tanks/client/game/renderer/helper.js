import Point from '@Lib/tanks/lib/data/primitives/Point.js';
import Level from '@Server/tanks/server/level/Level.js';

const helper = {
  offset(point, center) {
    if (!center) {
      return point;
    }

    const midX = Math.round(Level.WIDTH / 2);
    const midY = Math.round(Level.HEIGHT / 2);

    return Point.create(
      midX + point.x - center.x,
      midY + point.y - center.y
    );
  },

  outsideVisibleBoundaries(point) {
    return point.x < 0 || point.y < 0 || point.x > Level.WIDTH || point.y > Level.HEIGHT;
  }
};

export default helper;
