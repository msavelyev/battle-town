import World from '../../../../lib/src/data/World.js';
import level from '../../level.js';
import MessageType from '../../../../lib/src/proto/MessageType.js';
import NetMessage from '../../../../lib/src/proto/NetMessage.js';
import {FRAME_TIME} from '../../../../lib/src/Ticker.js';
import compareTick from '../../../../lib/src/util/compareTick.js';
import Match from '../../../../lib/src/data/Match.js';
import Player from './Player.js';

const WIDTH = 800;
const HEIGHT = 576;
const MAX_PLAYERS_IN_ROOM = 2;
const TICKS_TO_KEEP = 60;

export default class Room {

  constructor(id, ticker) {
    this.id = id;
    this.ticker = ticker;

    this.players = [];

    this.matches = [
      Match.n(
        id,
        World.n(id, WIDTH, HEIGHT),
        ticker.tick,
        level.choose()
      )
    ];
    this.events = [];
    this.queue = [];

    this.tickTimer = setInterval(() => {
      this.broadcast(MessageType.TICK, Match.encode(this.lastMatch()).finish());
    }, FRAME_TIME);

    this.finished = false;
  }

  lastMatch() {
    return this.matches[this.matches.length - 1];
  }

  update(event) {
    if (this.finished) {
      return;
    }

    const copy = Match.copy(this.lastMatch());
    Match.update(copy, event);
    if (Match.finished(copy)) {
      console.log('room is finished', this.id);
      this.finished = true;
    }

    this.addMatch(copy);

    let minTick = this.ticker.tick;
    for (let netMessage of this.queue) {
      switch (netMessage.type){
        case MessageType.SHOOT:
        case MessageType.MOVE:
          netMessage.tick = this.ticker.tick;
          Match.handleEvent(copy, netMessage);
          break;
        default:
          minTick = Math.min(minTick, netMessage.tick);
          break;
      }
      this.addEvent(netMessage);
    }

    if (minTick < this.ticker.tick) {
      this.recalculateMatch(minTick);
    }

    this.queue = [];
  }

  isFull() {
    return this.players.length >= MAX_PLAYERS_IN_ROOM;
  }

  isEmpty() {
    return this.players.length === 0;
  }

  add(player) {
    this.players.push(player);
    console.log('added player', player.user.id, 'to room', this.id);
    Match.addUser(this.lastMatch(), Player.shortUser(player));
  }

  remove(player) {
    console.log('players', this.players.length, 'removing one', player.user.id);
    this.players = this.players.filter(p => p !== player);
    const match = this.lastMatch();
    Match.removeTank(match, player.user.id, true);
    if (!this.finished) {
      Match.setWinner(match, this.players[0].user.id, match.tick);
    }

    this.broadcast(MessageType.DISCONNECTED, player.user.id);
  }

  broadcast(name, data, tick) {
    if (!tick) {
      tick = this.ticker.tick;
    }

    this.players.forEach(player => {
      player.client.sendMessage(new NetMessage(player.user.id, tick, name, data));
    });
  }

  addEvent(netMessage) {
    this.events = this._addTicked(netMessage, this.events);
  }

  addMatch(match) {
    this.matches = this._addTicked(match, this.matches);
  }

  _addTicked(what, where) {
    where.push(what);
    where.sort((a, b) => a.tick - b.tick);

    const maxTick = this.ticker.tick;
    return where.filter(item => compareTick(item.tick, (maxTick - TICKS_TO_KEEP)) >= 0);
  }

  stop() {
    clearInterval(this.tickTimer);
    for (let player of this.players) {
      player.client.disconnect();
    }

  }

  handleEvent(client, netMessage) {
    switch (netMessage.type) {
      case MessageType.MOVE:
      case MessageType.SHOOT:
        this.queue.push(netMessage);
        break;
      case MessageType.PING:
        client.sendMessage(new NetMessage(null, this.ticker.tick, MessageType.PING));
        break;
      default:
        console.error('Unknown message', netMessage);
    }
  }

  recalculateMatch(tick) {
    let prevMatch = null;

    if (compareTick(this.matches[0].tick, tick) >= 0) {
      return false;
    }

    for (let i = 0; i < this.matches.length; i++) {
      const currentMatch = this.matches[i];
      if (compareTick(currentMatch.tick, tick) < 0) {
        prevMatch = currentMatch;
        continue;
      }

      const currentEvent = currentMatch.event;
      const events = this.findEventsForTick(currentEvent.tick);
      const newMatch = Match.copy(prevMatch);
      for (let netMessage of events) {
        Match.handleEvent(newMatch, netMessage);
      }
      Match.update(newMatch, currentEvent);
      this.matches[i] = newMatch;

      prevMatch = newMatch;
    }

    return true;
  }

  findEventsForTick(tick) {
    return this.events.filter(event => event.tick === tick);
  }

}
