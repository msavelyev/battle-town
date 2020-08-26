import World from '../../../../lib/src/World.js';
import initLevel from '../../level.js';

const WIDTH = 800;
const HEIGHT = 576;
const MAX_PLAYERS_IN_ROOM = 2;

export default class Room {

  constructor(id) {
    this.id = id;
    this.world = new World(
      id,
      WIDTH,
      HEIGHT,
      initLevel(),
      [],
      []
    );

    this.players = [];
  }

  update(event) {
    this.world.update(event);
  }

  isFull() {
    return this.players.length >= MAX_PLAYERS_IN_ROOM;
  }

  isEmpty() {
    return this.players.length === 0;
  }

  add(player) {
    this.players.push(player);
    console.log('added player', player.id, 'to room', this.id);
  }

  remove(player) {
    this.players = this.players.filter(p => p !== player);
  }

  broadcast(player, name, data) {
    this.players.forEach(otherPlayer => {
      if (otherPlayer === player) {
        return;
      }

      otherPlayer.socket.send(name, data);
    });
  }

}
