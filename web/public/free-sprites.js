export function createSpriteSheet(unitSize) {
  const u = unitSize * 2;

  return {
    "jungle": {
      "frames": [[0, 0, u*2, u*2]]
    },
    "water": {
      "frames": [
        [u*2, 0, u*2, u*2],
        [u*4, 0, u*2, u*2],
        [u*6, 0, u*2, u*2],
        [u*8, 0, u*2, u*2]
      ],
      "loop": true,
      "frameLength": 30
    },
    "brick-tl": {
      "frames": [[0, u*2, u/2, u/2]]
    },
    "brick-tr": {
      "frames": [[u/2, u*2, u/2, u/2]]
    },
    "brick-bl": {
      "frames": [[0, u*2 + u/2, u/2, u/2]]
    },
    "brick-br": {
      "frames": [[u/2, u*2 + u/2, u/2, u/2]]
    },
    "stone": {
      "frames": [[u*2, u*2, u*2, u*2]]
    },
    "bullet": {
      "frames": [[u*4 + u/4, u*2 + u/8, u/2, u/2]]
    },
    "tank-moving": {
      "frames": [
        [0, u*4, u*2, u*2],
        [u*2, u*4, u*2, u*2],
        [u*4, u*4, u*2, u*2],
        [u*6, u*4, u*2, u*2],
        [u*8, u*4, u*2, u*2]
      ],
      "loop": true,
      "frameLength": 15
    },
    "tank-static": {
      "frames": [[0, u*4, u*2, u*2]]
    },
    "explosion": {
      "frames": [
        [0, u*6, u*2, u*2],
        [u*2, u*6, u*2, u*2],
        [u*4, u*6, u*2, u*2],
        [u*6, u*6, u*2, u*2],
        [u*8, u*6, u*2, u*2]
      ],
      "frameLength": 10,
      "loop": false
    }
  };
}
