import Block from '../../lib/src/Block.js';
import BlockType from '../../lib/src/BlockType.js';
import Point from '../../lib/src/Point.js';
import randomInt from '../../lib/src/randomInt.js';
import process from 'process';
import isTrue from '../../lib/src/util/isTrue.js';

const DEBUG_LEVEL = `
1111111111111111111111111
1000000000000000000000001
1050050000000000000000001
1000000000000000000000001
1000000000000000000000001
1000000222222200000000001
1000000200000200033330001
1000000202220200044440001
1000000202020200044440001
1000000202000200011110001
1000000202222200000000001
1000000200000000000000001
1000000222222200000000001
1000000000000000000000001
1000000000000000000000001
1000000000000000000000001
1000000000000000000000001
1111111111111111111111111
`;

const LEVELS = [
  `
    1111111111111111111111111
    1010000000202020002020151
    1010222222202020222020101
    1010200000202000202020101
    1010202020202220202000101
    1010202024244422202020101
    1010202024222444002020101
    1010002024442422222020101
    1000222022224424000020001
    1000200004244222202220001
    1010202222242444202000101
    1010202004442224202020101
    1010202022244424202020101
    1010002020222020202020101
    1010202020002020000020101
    1010202220202022222220101
    1510202000202020000000101
    1111111111111111111111111
  `
];

function getLevel(levelId) {
  if (isTrue(process.env.USE_DEBUG_LEVEL)) {
    return DEBUG_LEVEL;
  }

  return LEVELS[levelId];
}

const BLOCKS_PER_CELL = 2;

export default Object.freeze({
  choose: () => {
    return randomInt(0, LEVELS.length - 1)
  },

  generate: levelId => {
    const blocks = [];

    const level = getLevel(levelId);

    level.trim().split('\n').forEach((row, y) => {
      row.trim().split('').forEach((cell, x) => {
        const blockType = parseInt(cell);

        if (blockType === BlockType.EMPTY) {
          return;
        }

        if (blockType === BlockType.SPAWN) {
          const point = new Point(x * BLOCKS_PER_CELL, y * BLOCKS_PER_CELL);
          blocks.push(new Block(point, blockType));
          return;
        }

        for (let dx = 0; dx < BLOCKS_PER_CELL; dx++) {
          for (let dy = 0; dy < BLOCKS_PER_CELL; dy++) {
            const point = new Point(x * BLOCKS_PER_CELL + dx, y * BLOCKS_PER_CELL + dy);
            blocks.push(new Block(point, blockType));
          }
        }
      });
    });

    return blocks;
  },
});
