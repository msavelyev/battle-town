import * as Configuration from '@Lib/tanks/lib/data/Configuration.js';
import * as Entity from '@Lib/tanks/lib/data/entity/Entity.js';
import * as Match from '@Lib/tanks/lib/data/Match.js';
import * as MatchState from '@Lib/tanks/lib/data/MatchState.js';
import * as World from '@Lib/tanks/lib/data/World.js';
import * as ResetLevel from '@Lib/tanks/lib/data/worldevent/ResetLevel.js';
import * as ResetTanks from '@Lib/tanks/lib/data/worldevent/ResetTanks.js';
import * as Score from '@Lib/tanks/lib/data/worldevent/Score.js';
import * as State from '@Lib/tanks/lib/data/worldevent/State.js';
import * as TankUpdate from '@Lib/tanks/lib/data/worldevent/TankUpdate.js';
import EventType from '@Lib/tanks/lib/proto/EventType.js';
import MessageType from '@Lib/tanks/lib/proto/MessageType.js';
import NetMessage from '@Lib/tanks/lib/proto/NetMessage.js';
import {FPS} from '@Lib/tanks/lib/Ticker.js';
import {SETTINGS} from '@Lib/tanks/lib/util/dotenv.js';
import {copy} from '@Lib/tanks/lib/util/immutable.js';
import log from '@Lib/tanks/lib/util/log.js';
import Level from '@Server/tanks/server/level/Level.js';
import NetClient from '@Server/tanks/server/proto/base/NetClient.js';
import * as Room from '@Server/tanks/server/proto/game/Room.js';
import ReviveBlocks from '@Server/tanks/server/proto/game/event/ReviveBlocks.js';

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
    world = World.resetLevel(world, Level.ffa());
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
      world = World.resetLevel(world, Level.ffa());
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
    Room.send(this.room, ReviveBlocks());
  }

  stop() {
    clearInterval(this.blockReviveInterval);
  }

}
