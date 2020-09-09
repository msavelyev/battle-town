import MatchState from './MatchState.js';
import MessageType from './proto/MessageType.js';
import compareTick from './util/compareTick.js';
import World from './World.js';

export default class Match {

  constructor(id, users, world, score, tick, event, ack) {
    this.state = MatchState.PREPARE;
    this.users = users;
    this.world = world;

    this.score = score;
    this.tick = tick;
    this.event = event;
    this.ack = ack;

    this.unackedMessages = [];

    for (let user of this.users) {
      if (!this.score[user.id]) {
        this.score[user.id] = 0;
      }
    }
  }

  static addTank(match, tank) {
    World.addTank(match.world, tank);

    if (!match.score[tank.id]) {
      match.score[tank.id] = 0;
    }
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
    }

    World.update(match.world, event, (id, tank) => {
      match.score[id] += 1;

      if (match.world.authoritative) {
        const newTank = World.placeTank(match.world, tank);
        Match.addTank(match, newTank);
      }
    });
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
    match.score = data.score;
    match.ack = data.ack;
    match.tick = data.tick;
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

}
