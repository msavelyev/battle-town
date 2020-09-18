import Configuration from '../../../../lib/src/data/Configuration.js';
import Match from '../../../../lib/src/data/Match.js';
import MatchState from '../../../../lib/src/data/MatchState.js';
import World from '../../../../lib/src/data/World.js';
import EventType from '../../../../lib/src/proto/EventType.js';
import MessageType from '../../../../lib/src/proto/MessageType.js';
import NetMessage from '../../../../lib/src/proto/NetMessage.js';
import level from '../../level.js';
import Room from './Room.js';

export default class FFAGameMode {

  constructor(ticker) {
    this.ticker = ticker;
    this.room = null;
  }

  init() {
    this.room = new Room('FFA', this.ticker.tick);
    const match = this.room.match;
    const world = match.world;
    World.resetLevel(world, level.ffa());
    Match.setState(match, MatchState.WAITING_FOR_PLAYERS, this.ticker.tick);
  }

  authorizePlayer(player) {
    if (Room.hasPlayer(this.room, player)) {
      throw new Error('Already connected');
    }

    const client = player.client;
    const user = player.user;
    client.send(EventType.MATCH_FOUND);

    this.room.add(player);
    player.onDisconnect(() => {
      this.room.remove(player);
    });
    client.on(EventType.MESSAGE, netMessage => {
      this.room.handleEvent(client, netMessage);
    });

    const match = this.room.match;

    client.sendMessage(
      new NetMessage(user.id, MessageType.INIT, new Configuration(user.id, match))
    );

    if (this.room.size() === 2) {
      Match.setState(this.room.match, MatchState.PLAY, this.ticker.tick);
    }
  }

  update(event) {
    this.room.update(event, () => {}, () => {});
  }

  stop() {
  }

}
