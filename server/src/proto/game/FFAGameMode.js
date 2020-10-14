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
import level from '../../level/level.js';
import NetClient from '../base/NetClient.js';
import * as Room from './Room.js';
import reviveBlocks from './event/reviveBlocks.js';

export default class FFAGameMode {

  constructor(ticker) {
    this.ticker = ticker;
    this.room = null;

    this.blockReviveInterval = null;
  }

  init() {
    this.room = Room.create('FFA', this.ticker.tick);
    let match = this.room.match;
    let world = match.world;
    world = World.resetLevel(world, level.ffa());
    match = copy(match, {
      world,
    });
    match = Match.setState(match, MatchState.state.WAITING_FOR_PLAYERS, this.ticker.tick);
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

    log.info('authorized with tanks', match.world.tanks);

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
    if (Room.size(this.room) >= 2 && match.state === MatchState.state.WAITING_FOR_PLAYERS) {
      match = Match.setState(match, MatchState.state.PLAY, event.tick);
      match = copy(match, {
        nextStateOnTick: event.tick + SETTINGS.FFA_MATCH_LENGTH_SECONDS * FPS
      });
      updates.push(State.fromMatch(match));
    } else if (Room.size(this.room) === 1 && match.state === MatchState.state.PLAY) {
      match = Match.setState(match, MatchState.state.WAITING_FOR_PLAYERS, event.tick);
      updates.push(State.fromMatch(match));
    }

    if (match.state === MatchState.state.PLAY && match.nextStateOnTick <= event.tick) {
      match = Match.setWinner(match, Match.winner(match).id, event.tick);
      updates.push(State.fromMatch(match));
    } else if (match.state === MatchState.state.FINISHED && match.nextStateOnTick <= event.tick) {
      let world = match.world;
      world = World.resetLevel(world, level.ffa());
      updates.push(ResetLevel.create(world.blocks));

      world = World.resetTanks(world, match)
      for (let tank of world.tanks) {
        tank = Entity.revive(tank, event.tick);
        world = World.replaceTank(world, tank);
      }
      updates.push(ResetTanks.create(world.tanks));

      match = copy(match, {
        world
      });

      match = Match.resetScore(match);
      updates.push(Score.create(match.score));

      match = Match.setState(match, MatchState.state.PLAY, event.tick);
      match = copy(match, {
        nextStateOnTick: event.tick + SETTINGS.FFA_MATCH_LENGTH_SECONDS * FPS
      });
      updates.push(State.fromMatch(match));
    }

    return match;
  }

  onKill(match, event, killer, victimId, updates) {
    match = Match.increaseScore(match, killer);
    updates.push(Score.create(match.score));

    let world = match.world;
    let victimTank = World.findTank(world, victimId);
    victimTank = Entity.kill(victimTank, event.tick);
    world = World.replaceTank(world, victimTank);
    match = copy(match, {
      world
    });

    updates.push(TankUpdate.fromTank(victimTank));

    return match;
  }

  reviveBlocks() {
    Room.send(this.room, reviveBlocks());
  }

  stop() {
    clearInterval(this.blockReviveInterval);
  }

}
