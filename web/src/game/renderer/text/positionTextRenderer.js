
export default function(game) {
  return {
    update() {
      const point = game.ownPosition();
      return `pos: ${point.x},${point.y}`;
    }
  }
}
