import * as THREE from 'three';

import BlockType from 'Lib/tanks/lib/data/entity/BlockType.js';

function blockTypeToColor(blockType) {
  switch (blockType) {
    case BlockType.STONE:
      return 'grey';
    case BlockType.WATER:
      return 'blue';
    case BlockType.BRICK:
      return 'red';
    case BlockType.JUNGLE:
      return 'green';
    default:
      return null;
  }
}

function createBlock(block, gameSize, scene, toDispose) {
  const size = block.size * gameSize.unit;

  const color = blockTypeToColor(block.type);
  if (!color) {
    return;
  }

  const geometry = new THREE.PlaneGeometry(200, 200);
  toDispose.push(geometry);

  const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
  toDispose.push(material);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = block.position.x;
  mesh.position.y = block.position.y;
  scene.add(mesh);
}

export default function (game, scene, toDispose) {
  const {match, size} = game;
  const {world} = match;

  for (const block of world.blocks) {
    createBlock(block, size, scene, toDispose);
  }
}
