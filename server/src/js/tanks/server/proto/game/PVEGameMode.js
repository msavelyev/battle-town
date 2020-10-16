import Configuration from '@Lib/tanks/lib/data/Configuration.js';
import Match from '@Lib/tanks/lib/data/Match.js';
import MatchState from '@Lib/tanks/lib/data/MatchState.js';
import World from '@Lib/tanks/lib/data/World.js';
import BlockVisible from '@Lib/tanks/lib/data/worldevent/BlockVisible.js';
import EventType from '@Lib/tanks/lib/proto/EventType.js';
import MessageType from '@Lib/tanks/lib/proto/MessageType.js';
import NetMessage from '@Lib/tanks/lib/proto/NetMessage.js';
import immutable from '@Lib/tanks/lib/util/immutable.js';
import log from '@Lib/tanks/lib/util/log.js';
import InfiniteLevel from '@Lib/tanks/lib/level/InfiniteLevel.js';
import NetClient from '@Server/tanks/server/proto/base/NetClient.js';
import ReviveBlocks from '@Server/tanks/server/proto/game/event/ReviveBlocks.js';
import * as Room from '@Server/tanks/server/proto/game/Room.js';

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
    world = World.resetLevel(world, immutable.array());
    match = immutable.copy(match, {
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

    this.room.match = immutable.copy(this.room.match, {
      world,
    });
  }

}
