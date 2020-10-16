import {v4 as uuid} from 'uuid';
import * as Configuration from '@Lib/tanks/lib/data/Configuration.js';
import * as Match from '@Lib/tanks/lib/data/Match.js';
import * as MatchState from '@Lib/tanks/lib/data/MatchState.js';
import * as World from '@Lib/tanks/lib/data/World.js';
import * as Score from '@Lib/tanks/lib/data/worldevent/Score.js';
import * as State from '@Lib/tanks/lib/data/worldevent/State.js';
import * as TankRemove from '@Lib/tanks/lib/data/worldevent/TankRemove.js';
import EventType from '@Lib/tanks/lib/proto/EventType.js';
import MessageType from '@Lib/tanks/lib/proto/MessageType.js';
import NetMessage from '@Lib/tanks/lib/proto/NetMessage.js';
import {SETTINGS} from '@Lib/tanks/lib/util/dotenv.js';
import {copy} from '@Lib/tanks/lib/util/immutable.js';
import log from '@Lib/tanks/lib/util/log.js';
import database from '@Server/tanks/server/database.js';
import Level from '@Server/tanks/server/level/Level.js';
import NetClient from '@Server/tanks/server/proto/base/NetClient.js';
import GameMode from '@Server/tanks/server/proto/game/GameMode.js';
import Player from '@Server/tanks/server/proto/game/Player.js';
import * as Room from '@Server/tanks/server/proto/game/Room.js';

export default class PVPGameMode extends GameMode {

  constructor(db, ticker) {
    super();

    this.db = db;
    this.ticker = ticker;
    this.rooms = [];
    this.queue = [];
    this.matchmakingInterval = null;
  }

  init() {
    this.matchmakingInterval = setInterval(this.matchmake.bind(this), 1000);
  }

  matchmake() {
    while (this.queue.length >= 2) {
      const players = this.queue.slice(0, 2);
      this.queue = this.queue.slice(2);

      log.info('matchmaking players', players.map(p => p.user.id));

      for (let player of players) {
        NetClient.send(player.client, EventType.MATCH_FOUND);
        player.onDisconnect();
      }

      setTimeout(this.createMatch(players), 1000);
    }
  }

  createMatch(players) {
    return () => {
      const room = this.createRoom();
      let match = room.match;
      for (let player of players) {
        const client = player.client;
        const user = player.user;

        Room.add(room, player);

        NetClient.on(client, EventType.MESSAGE, netMessage => {
          Room.handleEvent(room, client, netMessage, user.id);
        });

        player.onDisconnect(() => {
          log.info('disconnected from match', user.id);
          this.removeFromRoom(room, player);
        });
      }

      match = copy(match, {
        world: World.resetTanks(match.world, match)
      });

      for (let player of players) {
        const client = player.client;
        const user = player.user;

        NetClient.sendMessage(
          client,
          NetMessage(user.id, MessageType.INIT, Configuration.create(user.id, match))
        );
      }
    };
  }

  createRoom() {
    const id = uuid();
    const room = Room.create(id, this.ticker.tick);
    Room.setLevel(room, Level.generate(Level.choose()));
    log.info('created room', id);
    this.rooms.push(room);

    return room;
  }

  removeFromRoom(room, player) {
    Room.remove(room, player);
    if (!room.finished) {
      const player = room.players[0];
      if (player) {
        room.match = Match.setWinner(room.match, player.user.id, room.match.tick);
      }
    }

    if (Room.isEmpty(room)) {
      log.info('removing room', room.id);
      Room.stop(room);
      this.rooms = this.rooms.filter(r => r !== room);
    }
  }

  authorizePlayer(player) {
    const user = player.user;

    if (this.queue.find(p => p.user.id === user.id)) {
      throw new Error('Already queued');
    }

    this.queue.push(player);

    player.onDisconnect(() => {
      log.info('disconnected from queue', user.id);
      this.queue = this.queue.filter(p => p !== player);
    });

    if (SETTINGS.ALLOW_SINGLE) {
      this.queue.push(Player.bot());
    }
  }

  update(event) {
    for (let room of this.rooms) {
      Room.update(room, event, this.beforeWorldUpdate.bind(this), this.onKill.bind(this));
      if (room.finished) {
        this.assignPoints(room.match);
        Room.stop(room);
      }
    }
  }

  beforeWorldUpdate(match, event, updates) {
    match = copy(match, {
      tick: event.tick,
      event: event,
    });

    if (match.nextStateOnTick === event.tick) {
      match = Match.transitionState(match, event, updates);
      updates.push(State.fromMatch(match));
    }

    return match;
  }

  onKill(match, event, killer, victim, updates) {
    if (match.state === MatchState.state.PLAY) {
      match = copy(match, {
        world: World.removeTank(match.world, victim.id)
      });
      updates.push(TankRemove.create(victim.id));

      match = Match.increaseScore(match, killer);
      updates.push(Score.create(match.score));

      if (match.world.authoritative) {
        match = Match.transitionState(match, event, updates);
        match = copy(match, {
          stateSpotlight: killer,
        });
        updates.push(State.fromMatch(match));
      }
    }

    return match;
  }

  assignPoints(match) {
    const winner = Match.winner(match).id;
    for (let user of match.users) {
      const points = user.id === winner ? 3 : 1;
      database.addPoints(this.db, user.id, points)
        .catch(err => {
          console.err(`Adding ${points} to user ${user.id}`, err);
        });
    }
  }

  stop() {
    clearInterval(this.matchmakingInterval);
  }

}
