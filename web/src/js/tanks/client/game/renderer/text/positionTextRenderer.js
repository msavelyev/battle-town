
export default function(game) {
  return () => {
    const point = game.ownPosition();
    return `pos: ${point.x},${point.y}`;
  }
}
