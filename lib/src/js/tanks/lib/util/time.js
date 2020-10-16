function formatTwoDigits(number) {
  if (number < 10) {
    return `0${number}`;
  } else {
    return `${number}`;
  }
}

function convertToTime(elapsed) {
  const seconds = formatTwoDigits(elapsed % 60);
  const minutes = Math.floor(elapsed / 60);

  return `${minutes}:${seconds}`;
}
module.exports.convertToTime = convertToTime;

