import {BlockType} from '../../../lib/src/data/entity/BlockType.js';
import Point from '../../../lib/src/data/primitives/Point.js';
import * as rand from '../../../lib/src/util/rand.js';
import Level from './Level.js';

const VIS_RAD = 10;

function roundPosition(point) {
  point = Point.round(point);

  const x = point.x - point.x % Level.BLOCK_SIZE;
  const y = point.y - point.y % Level.BLOCK_SIZE;
  return Point.create(x, y);
}

const SAFE_AREA_SIZE = 4 * Level.BLOCK_SIZE;

function isSafeArea(point) {
  if (point.x < -SAFE_AREA_SIZE) {
    return false;
  } else if (point.x > SAFE_AREA_SIZE) {
    return false;
  } else if (point.y < -SAFE_AREA_SIZE) {
    return false;
  } else if (point.y > SAFE_AREA_SIZE) {
    return false;
  } else {
    return true;
  }
}

function randomBlock(point) {
  if (isSafeArea(point)) {
    return BlockType.EMPTY;
  }

  const val = rand.valueNoise(point.x, point.y);

  if (val < 0.3) {
    return BlockType.EMPTY;
  } else if (val < 0.35) {
    return BlockType.WATER;
  } else if (val < 0.6) {
    return BlockType.BRICK;
  } else if (val < 0.8) {
    return BlockType.STONE;
  } else {
    return BlockType.JUNGLE;
  }
}

function pointsToBlocks(points) {
  const blocks = [];

  for (const point of points) {
    const blockType = randomBlock(point);

    for (let block of Level.createBlocksForPoint(point, blockType)) {
      blocks.push(block);
    }
  }

  return blocks;
}

function visibility(point) {
  const center = roundPosition(point);

  const result = [];
  for (let dx = -VIS_RAD; dx < VIS_RAD + 1; dx++) {
    for (let dy = -VIS_RAD; dy < VIS_RAD + 1; dy++) {
      const x = center.x + dx * Level.BLOCK_SIZE;
      const y = center.y + dy * Level.BLOCK_SIZE;

      result.push(Point.create(x, y));
    }
  }

  return result;
}

export default {
  blocksDiff(first, last) {
    first = roundPosition(first);
    last = roundPosition(last);

    const dx = last.x - first.x;
    const dy = last.y - first.y;

    const points = [];
    if (dx < 0) {
      for (let i = -VIS_RAD; i < VIS_RAD + 1; i++) {
        points.push(Point.create(
          last.x - VIS_RAD * Level.BLOCK_SIZE,
          last.y + i * Level.BLOCK_SIZE
        ));
      }
    }
    if (dy < 0) {
      for (let i = -VIS_RAD; i < VIS_RAD + 1; i++) {
        points.push(Point.create(
          last.x + i * Level.BLOCK_SIZE,
          last.y - VIS_RAD * Level.BLOCK_SIZE
        ));
      }
    }
    if (dx > 0) {
      for (let i = -VIS_RAD; i < VIS_RAD + 1; i++) {
        points.push(Point.create(
          last.x + VIS_RAD * Level.BLOCK_SIZE,
          last.y + i * Level.BLOCK_SIZE
        ));
      }
    }
    if (dy > 0) {
      for (let i = -VIS_RAD; i < VIS_RAD + 1; i++) {
        points.push(Point.create(
          last.x + i * Level.BLOCK_SIZE,
          last.y + VIS_RAD * Level.BLOCK_SIZE
        ));
      }
    }
    if (dy < 0 && dx < 0) {
      points.push(Point.create(
        last.x - VIS_RAD * Level.BLOCK_SIZE,
        last.y - VIS_RAD * Level.BLOCK_SIZE
      ));
    }
    if (dy > 0 && dx > 0) {
      points.push(Point.create(
        last.x + VIS_RAD * Level.BLOCK_SIZE,
        last.y + VIS_RAD * Level.BLOCK_SIZE
      ));
    }

    return pointsToBlocks(points);
  },

  initBlocks(center) {
    const points = visibility(center);
    return pointsToBlocks(points);
  },

  SAFE_AREA_SIZE,
};
