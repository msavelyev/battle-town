function formatTwoDigits(number) {
  if (number < 10) {
    return `0${number}`;
  } else {
    return `${number}`;
  }
}

export function convertToTime(elapsed) {
  const seconds = formatTwoDigits(elapsed % 60);
  const minutes = Math.floor(elapsed / 60);

  return `${minutes}:${seconds}`;
}

