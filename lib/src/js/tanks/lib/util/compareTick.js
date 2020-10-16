const OVERFLOW_THRESHOLD = 10000;

module.exports = function compareTick(a, b) {
  if (a === b) {
    return 0;
  }

  if (Math.abs(a - b) < OVERFLOW_THRESHOLD) {
    return a < b ? -1 : 1;
  } else {
    return a < b ? 1 : -1;
  }

};
