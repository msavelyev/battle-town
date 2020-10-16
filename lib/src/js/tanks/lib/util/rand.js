const random = Math.random;

function randomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(random() * (max - min + 1)) + min;
}
module.exports.randomInt = randomInt;

const VALUE_NOISE_PRECOMPUTED = []
const VALUE_NOISE_SIZE = 1023;

function initValueNoise() {

  for (let i = 0; i < VALUE_NOISE_SIZE; i++) {
    VALUE_NOISE_PRECOMPUTED[i] = random();
  }
}

initValueNoise();

function valueNoise(x, y) {
  const i = Math.abs(Math.floor((x * 31) ^ (y * 47)));
  return VALUE_NOISE_PRECOMPUTED[i % VALUE_NOISE_SIZE];
}
module.exports.valueNoise = valueNoise;
