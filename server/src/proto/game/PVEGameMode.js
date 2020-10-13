import * as Configuration from '../../../../lib/src/data/Configuration.js';
import * as Match from '../../../../lib/src/data/Match.js';
import * as MatchState from '../../../../lib/src/data/MatchState.js';
import * as World from '../../../../lib/src/data/World.js';
import EventType from '../../../../lib/src/proto/EventType.js';
import MessageType from '../../../../lib/src/proto/MessageType.js';
import {NetMessage} from '../../../../lib/src/proto/NetMessage.js';
import {array, copy} from '../../../../lib/src/util/immutable.js';
import ReviveBlocks from './event/ReviveBlocks.js';
import * as Room from './Room.js';

export default class PVEGameMode {

  constructor(ticker) {
    this.ticker = ticker;
    this.room = null;

    this.blockReviveInterval = null;
  }

  init() {
    this.room = Room.create('PVE', this.ticker.tick);
    let match = this.room.match;
    let world = match.world;
    world = World.resetLevel(world, array());
    match = copy(match, {
      world,
    });
    match = Match.setState(match, MatchState.state.PLAY, this.ticker.tick);
    this.room.match = match;

    this.blockReviveInterval = setInterval(this.reviveBlocks.bind(this), 60000);
  }

  authorizePlayer(player) {
    if (Room.hasPlayer(this.room, player)) {
      throw new Error('Already connected');
    }

    const client = player.client;
    const user = player.user;
    client.send(EventType.MATCH_FOUND);

    Room.add(this.room, player);
    player.onDisconnect(this.onDisconnect(player));
    client.on(EventType.MESSAGE, netMessage => {
      Room.handleEvent(this.room, client, netMessage, user.id);
    });

    const match = this.room.match;

    client.sendMessage(
      NetMessage(user.id, MessageType.INIT, Configuration.create(user.id, match))
    );
  }

  onDisconnect(player) {
    return () => {
      Room.remove(this.room, player);
    };
  }

  update(event) {
    Room.update(
      this.room,
      event,
      this.onBeforeWorldUpdate.bind(this),
      this.onKill.bind(this)
    );
  }

  onBeforeWorldUpdate(match, event, updates) {
    return match;
  }

  onKill(match, event, killer, victimId, updates) {
    return match;
  }

  reviveBlocks() {
    Room.send(this.room, new ReviveBlocks());
  }

  stop() {
    clearInterval(this.blockReviveInterval);
  }

}
