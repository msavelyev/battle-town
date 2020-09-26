import seedrandom from 'seedrandom';

const random = seedrandom('hello');

export default function randomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(random() * (max - min + 1)) + min;
}
