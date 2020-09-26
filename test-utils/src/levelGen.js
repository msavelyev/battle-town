import chalk from 'chalk';
import BlockType from '../../lib/src/data/BlockType.js';
import Direction from '../../lib/src/data/Direction.js';
import Point from '../../lib/src/data/Point.js';
import randomInt from '../../lib/src/util/randomInt.js';
import level from '../../server/src/level.js';

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

function randomBlock() {
  return randomInt(0, 5);
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
  setBlock(level, point, randomBlock());
}

function generateLevel(radius) {
  const size = radius * 2 + 1;
  const x = Math.floor((size - 1) / 2);
  const y = Math.floor((size - 1) / 2);
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
  const side = r * 2 + 1;
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
  if (x === 0) {
    print('\n');
  }

  const color = COLORS[cell];
  print(chalk.hex(color).bgHex(color)('aa'));
}

function printLevel(lvl) {
  level.iterate(lvl, (x, y, cell) => {
    printCell(x, y, cell);
  });

  print('\n');
}

function printGeneratedLevel(lvl) {
  for (let y = 0; y < lvl.length; y++) {
    for (let x = 0; x < lvl[y].length; x++) {
      const cell = lvl[x][y];

      printCell(x, y, cell);
    }
  }
}

const lvl = generateLevel(10);
console.log(lvl);
printGeneratedLevel(lvl);

// printLevel(FFA_LEVEL);

// console.log(circle(new Point(0, 0), 0));
