import chalk from 'chalk';
import BlockType from '../../lib/src/data/BlockType.js';
import Direction from '../../lib/src/data/Direction.js';
import Point from '../../lib/src/data/Point.js';
import * as rand from '../../lib/src/util/rand.js';

function print() {
  process.stdout.write(...arguments);
}

const COLORS = {
  [BlockType.EMPTY]: '#fff',
  [BlockType.SPAWN]: '#fff',
  [BlockType.STONE]: '#666',
  [BlockType.BRICK]: '#c60',
  [BlockType.WATER]: '#44f',
  [BlockType.JUNGLE]: '#4c4',
};

function randomBlock(point) {
  const val = rand.valueNoise(point.x, point.y);

  return Math.floor(val * 5);
}

function setBlock(level, point, block) {
  const x = point.x;
  const y = point.y;

  if (level[y] === undefined) {
    level[y] = [];
  }

  level[y][x] = block;
}

function generateBlock(level, point) {
  setBlock(level, point, randomBlock(point));
}

function generateLevel(radius, offset) {
  const size = radius * 2 + 1;
  const x = Math.floor((size - 1) / 2) + offset;
  const y = Math.floor((size - 1) / 2) + offset;
  const start = new Point(x, y);

  console.log('start', start);

  const result = [];
  generateBlock(result, start);

  for (let r = 1; r <= radius; r++) {
    for (let point of circle(start, r)) {
      generateBlock(result, point);
    }
  }

  return result;
}

function circle(center, r) {
  const tl = new Point(center.x - r, center.y - r);
  const br = new Point(center.x + r, center.y + r);

  const start = new Point(center.x - r, center.y);

  const result = [];

  let current = start;
  let direction = Direction.UP;
  do {
    const next = Point.move(current, direction, 1);
    if (Point.within(next, tl, br)) {
      result.push(next);
      current = next;
    } else {
      direction = Direction.next(direction);
    }
  } while (!Point.eq(current, start));

  return result;
}

function printCell(x, y, cell) {
  const color = COLORS[cell];
  print(chalk.hex(color).bgHex(color)('aa'));
}

function printGeneratedLevel(lvl, offset) {
  for (let y = offset; y < lvl.length; y++) {
    print('\n');
    for (let x = offset; x < lvl[y].length; x++) {
      const cell = lvl[x][y];

      printCell(x, y, cell);
    }
  }
}

const offset = 5;
const lvl = generateLevel(10, offset);
printGeneratedLevel(lvl, offset);

// printLevel(FFA_LEVEL);

// console.log(circle(new Point(0, 0), 0));
