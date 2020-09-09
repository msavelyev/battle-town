import MatchState from './MatchState.js';
import MessageType from './proto/MessageType.js';
import compareTick from './util/compareTick.js';
import World from './World.js';
import level from '../../server/src/level.js';

export default class Match {

  constructor(id, world, tick, levelId) {
    this.state = MatchState.PREPARE;

    this.users = [];
    this.world = world;

    this.score = {};
    this.tick = tick;
    this.event = null;
    this.ack = {};
    this.levelId = levelId;

    World.resetLevel(world, level.generate(levelId));

    this.stateSinceTick = tick;
    this.nextStateOnTick = MatchState.nextStateOnTick(this.state, tick);

    this.unackedMessages = [];
  }

  static removeTank(match, id, cleanScore) {
    World.removeTank(match.world, id);

    if (cleanScore) {
      delete match.score[id];
    }
  }

  static update(match, event) {
    if (match.world.authoritative) {
      match.tick = event.tick;
      match.event = event;

      if (match.nextStateOnTick === event.tick) {
        Match.transitionState(match, event);
      }
    }

    World.update(match.world, event, id => {
      match.score[id] += 1;

      if (match.world.authoritative) {
        Match.transitionState(match, event);
      }
    });
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
        return false;
    }
  }

  static handleMove(match, netMessage, method) {
    if (!MatchState.movable(match.state)) {
      return false;
    }

    const tankMove = netMessage.data;
    const id = netMessage.id;

    Match.addAck(match, id, tankMove.moveId);

    return method(match.world, id, tankMove.direction);
  }

  static addAck(match, id, moveId) {
    match.ack[id] = Math.max(moveId, match.ack[id]);
  }

  static addUnackedMessage(match, netMessage) {
    match.unackedMessages.push(netMessage);
  }

  static sync(match, id, data) {
    match.state = data.state;
    match.score = data.score;
    match.ack = data.ack;
    match.tick = data.tick;
    match.nextStateOnTick = data.nextStateOnTick;
    World.sync(match.world, data.world);

    match.unackedMessages = match.unackedMessages.filter(move => {
      if (match.ack[id] === undefined) {
        return true;
      }

      return compareTick(move.data.moveId, match.ack[id]) > 0;
    });

    for (let netMessage of match.unackedMessages) {
      switch (netMessage.type) {
        case MessageType.MOVE:
          const move = netMessage.data;
          World.move(match.world, id, move.direction);
          break;
        case MessageType.SHOOT:
          // newBullets = this.replaceEntity(newBullets, this.findBullet(id));
          break;
      }
    }
  }

  static copy(match) {
    return JSON.parse(JSON.stringify(match));
  }

  static transitionState(match, event) {
    switch (match.state) {
      case MatchState.PREPARE:
        match.state = MatchState.READY;
        break;
      case MatchState.READY:
        match.state = MatchState.PLAY;
        break;
      case MatchState.PLAY:
        match.state = MatchState.SCORE;
        break;
      case MatchState.SCORE:
        match.state = MatchState.READY;
        break;
    }

    if (match.state === MatchState.READY) {
      World.resetLevel(match.world, level.generate(match.levelId));
      World.resetTanks(match.world, match);
    }

    match.stateSinceTick = event.tick;
    match.nextStateOnTick = MatchState.nextStateOnTick(match.state, event.tick);
  }

  static addUser(match, user) {
    match.users.push(user);
    match.score[user.id] = 0;
  }

}
