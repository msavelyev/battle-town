import Configuration from '../../../../lib/src/data/Configuration.js';
import Entity from '../../../../lib/src/data/Entity.js';
import Match from '../../../../lib/src/data/Match.js';
import MatchState from '../../../../lib/src/data/MatchState.js';
import World from '../../../../lib/src/data/World.js';
import * as ResetLevel from '../../../../lib/src/data/worldevent/ResetLevel.js';
import * as ResetTanks from '../../../../lib/src/data/worldevent/ResetTanks.js';
import * as Score from '../../../../lib/src/data/worldevent/Score.js';
import * as State from '../../../../lib/src/data/worldevent/State.js';
import * as TankUpdate from '../../../../lib/src/data/worldevent/TankUpdate.js';
import EventType from '../../../../lib/src/proto/EventType.js';
import MessageType from '../../../../lib/src/proto/MessageType.js';
import NetMessage from '../../../../lib/src/proto/NetMessage.js';
import {FPS} from '../../../../lib/src/Ticker.js';
import {SETTINGS} from '../../../../lib/src/util/dotenv.js';
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
    const match = this.room.match;
    const world = match.world;
    World.resetLevel(world, level.ffa());
    Match.setState(match, MatchState.WAITING_FOR_PLAYERS, this.ticker.tick);

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
      new NetMessage(user.id, MessageType.INIT, new Configuration(user.id, match))
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
    if (this.room.size() >= 2 && match.state === MatchState.WAITING_FOR_PLAYERS) {
      Match.setState(match, MatchState.PLAY, event.tick);
      match.nextStateOnTick = event.tick + SETTINGS.FFA_MATCH_LENGTH_SECONDS * FPS;
      updates.push(State.fromMatch(match));
    } else if (this.room.size() === 1 && match.state === MatchState.PLAY) {
      Match.setState(match, MatchState.WAITING_FOR_PLAYERS, event.tick);
      updates.push(State.fromMatch(match));
    }

    if (match.state === MatchState.PLAY && match.nextStateOnTick <= event.tick) {
      Match.setWinner(match, Match.winner(match).id, event.tick);
      updates.push(State.fromMatch(match));
    } else if (match.state === MatchState.FINISHED && match.nextStateOnTick <= event.tick) {
      const world = match.world;
      World.resetLevel(world, level.ffa());
      updates.push(ResetLevel.create(world.blocks));

      World.resetTanks(world, match);
      for (let tank of world.tanks) {
        Entity.revive(tank, event.tick);
      }
      updates.push(ResetTanks.create(world.tanks));

      Match.resetScore(match);
      updates.push(Score.create(match.score));

      Match.setState(match, MatchState.PLAY, event.tick);
      match.nextStateOnTick = event.tick + SETTINGS.FFA_MATCH_LENGTH_SECONDS * FPS;
      updates.push(State.fromMatch(match));
    }
  }

  onKill(match, event, killer, victimId, updates) {
    match.score[killer] += 1;
    updates.push(Score.create(match.score));

    const world = match.world;
    const victimTank = World.findTank(world, victimId);
    Entity.kill(victimTank, event.tick);

    updates.push(TankUpdate.fromTank(victimTank));
  }

  reviveBlocks() {
    Room.send(this.room, new ReviveBlocks());
  }

  stop() {
    clearInterval(this.blockReviveInterval);
  }

}
