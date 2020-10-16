import chalk from 'chalk';
import { BlockType } from '@Lib/tanks/lib/data/entity/BlockType.js';
import * as Direction from '@Lib/tanks/lib/data/primitives/Direction.js';
import Point from '@Lib/tanks/lib/data/primitives/Point.js';
import * as rand from '@Lib/tanks/lib/util/rand.js';

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

// noinspection JSUnusedLocalSymbols
function generateLevel(radius, offset) {
  const size = radius * 2 + 1;
  const x = Math.floor((size - 1) / 2) + offset;
  const y = Math.floor((size - 1) / 2) + offset;
  const start = Point.create(x, y);

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
  const tl = Point.create(center.x - r, center.y - r);
  const br = Point.create(center.x + r, center.y + r);

  const start = Point.create(center.x - r, center.y);

  const result = [];

  let current = start;
  let direction = Direction.Direction.UP;
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

function printCell(cell) {
  const color = COLORS[cell];
  print(chalk.hex(color).bgHex(color)('aa'));
}

// noinspection JSUnusedLocalSymbols
function printGeneratedLevel(lvl, offset) {
  for (let y = offset; y < lvl.length; y++) {
    print('\n');
    for (let x = offset; x < lvl[y].length; x++) {
      const cell = lvl[y][x];

      printCell(cell);
    }
  }
}

function printLevel(start, size) {
  for (let y = start.y; y < start.y + size; y++) {
    print('\n');
    for (let x = start.x; x < start.x + size; x++) {
      printCell(randomBlock(Point.create(x, y)));
    }
  }
}

const offset = -1;
const size = 10;
// const lvl = generateLevel(size, offset);
// printGeneratedLevel(lvl, offset);

printLevel(Point.create(offset, offset), size * 2 + 1);

// printLevel(FFA_LEVEL);

// console.log(circle(Point.create(0, 0), 0));
