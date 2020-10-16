import * as Configuration from '../../../../../../lib/src/tanks/lib/data/Configuration.js';
import * as Match from '../../../../../../lib/src/tanks/lib/data/Match.js';
import * as MatchState from '../../../../../../lib/src/tanks/lib/data/MatchState.js';
import * as World from '../../../../../../lib/src/tanks/lib/data/World.js';
import BlockVisible from '../../../../../../lib/src/tanks/lib/data/worldevent/BlockVisible.js';
import EventType from '../../../../../../lib/src/tanks/lib/proto/EventType.js';
import MessageType from '../../../../../../lib/src/tanks/lib/proto/MessageType.js';
import NetMessage from '../../../../../../lib/src/tanks/lib/proto/NetMessage.js';
import {array, copy} from '../../../../../../lib/src/tanks/lib/util/immutable.js';
import log from '../../../../../../lib/src/tanks/lib/util/log.js';
import InfiniteLevel from '../../level/InfiniteLevel.js';
import NetClient from '../base/NetClient.js';
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
    this.room.onConnect = this.onConnect.bind(this);
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
    NetClient.send(client, EventType.MATCH_FOUND);

    Room.add(this.room, player);
    player.onDisconnect(this.onDisconnect(player));
    NetClient.on(client, EventType.MESSAGE, netMessage => {
      Room.handleEvent(this.room, client, netMessage, user.id);
    });

    const match = this.room.match;

    NetClient.sendMessage(
      client,
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
    Room.send(this.room, ReviveBlocks());
  }

  stop() {
    clearInterval(this.blockReviveInterval);
  }

  onConnect(room, userId, updates) {
    let world = this.room.match.world;
    let tank = World.findTank(world, userId);
    log.info('found tank', tank);

    for (const block of InfiniteLevel.initBlocks(tank.position)) {
      world = World.updateBlockVisibility(world, block, +1);
      updates.push(BlockVisible.create(block, userId));
    }

    this.room.match = copy(this.room.match, {
      world,
    });
  }

}
