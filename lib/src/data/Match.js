import MatchState from './MatchState.js';
import MessageType from '../proto/MessageType.js';
import compareTick from '../util/compareTick.js';
import World from './World.js';
import level from '../../../server/src/level.js';

import {SETTINGS} from '../util/dotenv.js';
import analytics from '../util/analytics.js';
import ResetLevel from './worldevent/ResetLevel.js';
import ResetTanks from './worldevent/ResetTanks.js';
import State from './worldevent/State.js';
import WorldEventType from './worldevent/WorldEventType.js';

export default class Match {

  constructor(id, world, tick) {
    this.state = MatchState.PREPARE;

    this.users = [];
    this.world = world;

    this.score = {};
    this.tick = tick;
    this.event = null;
    this.ack = {};

    this.stateSinceTick = tick;
    this.nextStateOnTick = MatchState.nextStateOnTick(this.state, tick);
    this.stateSpotlight = null;

    this.unackedMessages = [];
  }

  static removeTank(match, id, cleanScore) {
    World.removeTank(match.world, id);

    if (cleanScore) {
      delete match.score[id];
    }
  }

  static update(match, event, beforeWorld, onKill) {
    const updates = [];

    beforeWorld(match, event, updates);

    const worldUpdates = World.update(match.world, event, id => {
      onKill(match, event, id, updates);
    });

    return updates.concat(worldUpdates);
  }

  static findUser(match, id) {
    return match.users.find(user => user.id === id);
  }

  static handleEvent(match, netMessage) {
    switch (netMessage.type) {
      case MessageType.MOVE:
        return Match.handleMove(match, netMessage, World.move);
      case MessageType.SHOOT:
        return Match.handleMove(match, netMessage, World.shoot);
      default:
        console.error('Unknown message', netMessage);
        return null;
    }
  }

  static handleMove(match, netMessage, method) {
    const tankMove = netMessage.data;
    const id = netMessage.id;

    Match.addAck(match, id, tankMove.moveId);

    if (netMessage.type === MessageType.MOVE && !MatchState.movable(match.state)) {
      return null;
    }

    if (netMessage.type === MessageType.SHOOT && !MatchState.shootable(match.state)) {
      return null;
    }

    return method(match.world, id, tankMove.direction);
  }

  static addAck(match, id, moveId) {
    const oldAck = match.ack[id] || -1;
    match.ack[id] = Math.max(moveId, oldAck);
  }

  static addUnackedMessage(match, netMessage) {
    match.unackedMessages.push(netMessage);
  }

  static sync(match, id, tickData) {
    match.tick = tickData.tick;
    match.ack = tickData.ack;

    match.unackedMessages = match.unackedMessages.filter(move => {
      if (match.ack[id] === undefined) {
        return true;
      }

      return compareTick(move.data.moveId, match.ack[id]) > 0;
    });

    for (let data of tickData.updates) {
      switch (data.type) {
        case WorldEventType.STATE:
          State.toMatch(data, match);
          Match.trackMatchTransition(match, id);
          break;
        case WorldEventType.SCORE:
          match.score = data.score;
          break;
        default:
          break;
      }
    }

    World.sync(match.world, tickData.updates, id, match.unackedMessages);
  }

  static trackMatchTransition(match, id) {
    if (match.state === MatchState.SCORE && match.stateSpotlight === id) {
      analytics.log('MATCH_SCORE');
    } else if (match.state === MatchState.FINISHED && match.stateSpotlight === id) {
      analytics.log('MATCH_WIN');
    } else if (match.state === MatchState.FINISHED && match.stateSpotlight !== id) {
      analytics.log('MATCH_LOSS');
    }
  }

  static transitionState(match, event, updates) {
    switch (match.state) {
      case MatchState.PREPARE:
        match.state = MatchState.READY;
        break;
      case MatchState.READY:
        match.state = MatchState.PLAY;
        break;
      case MatchState.PLAY:
        if (Match.maxScore(match) === SETTINGS.SCORE_TO_WIN) {
          Match.setWinner(match, Match.winner(match).id, event.tick);
          return;
        }
        match.state = MatchState.SCORE;
        break;
      case MatchState.SCORE:
        World.resetLevel(match.world, level.generate(level.choose()));
        World.resetTanks(match.world, match);
        updates.push(new ResetLevel(match.world.blocks));
        updates.push(new ResetTanks(match.world.tanks));

        match.state = MatchState.READY;
        break;
      case MatchState.FINISHED:
        return;
    }

    match.stateSpotlight = null;
    match.stateSinceTick = event.tick;
    match.nextStateOnTick = MatchState.nextStateOnTick(match.state, event.tick);
  }

  static addUser(match, user) {
    match.users.push(user);
    match.score[user.id] = 0;
  }

  static maxScore(match) {
    return Match.winner(match).score;
  }

  static winner(match) {
    return Object.entries(match.score)
      .map(entry => ({id: entry[0], score: entry[1]}))
      .sort((a, b) => b.score - a.score)
      [0];
  }

  static finished(match) {
    return match.state === MatchState.FINISHED
      && match.nextStateOnTick <= match.tick;
  }

  static setWinner(match, winner, tick) {
    match.state = MatchState.FINISHED;
    match.stateSpotlight = winner;
    match.stateSinceTick = tick;
    match.nextStateOnTick = MatchState.nextStateOnTick(match.state, tick);
  }

}
