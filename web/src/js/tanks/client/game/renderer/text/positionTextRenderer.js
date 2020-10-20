
export default function(game) {
  return () => {
    const point = game.ownPosition();
    if (point) {
      return `pos: ${point.x},${point.y}`;
    } else {
      return 'pos:';
    }
  }
}
