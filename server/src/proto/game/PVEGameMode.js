import * as Configuration from '../../../../lib/src/data/Configuration.js';
import * as Entity from '../../../../lib/src/data/entity/Entity.js';
import * as Match from '../../../../lib/src/data/Match.js';
import * as MatchState from '../../../../lib/src/data/MatchState.js';
import * as World from '../../../../lib/src/data/World.js';
import * as ResetLevel from '../../../../lib/src/data/worldevent/ResetLevel.js';
import * as ResetTanks from '../../../../lib/src/data/worldevent/ResetTanks.js';
import * as Score from '../../../../lib/src/data/worldevent/Score.js';
import * as State from '../../../../lib/src/data/worldevent/State.js';
import * as TankUpdate from '../../../../lib/src/data/worldevent/TankUpdate.js';
import EventType from '../../../../lib/src/proto/EventType.js';
import MessageType from '../../../../lib/src/proto/MessageType.js';
import { NetMessage } from '../../../../lib/src/proto/NetMessage.js';
import {FPS} from '../../../../lib/src/Ticker.js';
import {SETTINGS} from '../../../../lib/src/util/dotenv.js';
import {copy} from '../../../../lib/src/util/immutable.js';
import log from '../../../../lib/src/util/log.js';
import level from '../../level.js';
import Room from './Room.js';
import ReviveBlocks from './event/ReviveBlocks.js';

export default class FFAGameMode {

  constructor(ticker) {
    this.ticker = ticker;
    this.room = null;

    this.blockReviveInterval = null;
  }

  init() {
    this.room = new Room('FFA', this.ticker.tick);
    let match = this.room.match;
    let world = match.world;
    world = World.resetLevel(world, level.ffa());
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

    this.room.add(player);
    player.onDisconnect(this.onDisconnect(player));
    client.on(EventType.MESSAGE, netMessage => {
      this.room.handleEvent(client, netMessage, user.id);
    });

    const match = this.room.match;

    log.info('authorized with tanks', match.world.tanks);

    client.sendMessage(
      NetMessage(user.id, MessageType.INIT, Configuration.create(user.id, match))
    );
  }

  onDisconnect(player) {
    return () => {
      this.room.remove(player);
    };
  }

  update(event) {
    this.room.update(
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
