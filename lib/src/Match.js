import MatchState from './MatchState.js';
import EntityType from './EntityType.js';
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

  toJSON() {
    return {
      state: this.state,
      users: this.users,
      world: this.world,
      score: this.score,
      tick: this.tick,
      event: this.event,
      ack: this.ack,
    };
  }

  addTank(tank) {
    this.world.addTank(tank);

    if (!this.score[tank.id]) {
      this.score[tank.id] = 0;
    }
  }

  removeTank(id, cleanScore) {
    this.world.removeTank(id);

    if (cleanScore) {
      delete this.score[id];
    }
  }

  collides(entity) {
    const collisions = this.world.collides(entity);

    if (collisions.length > 0 && entity.entityType === EntityType.BULLET) {
      if (collisions.find(collision => collision.entityType === EntityType.TANK)) {
        this.score[entity.id] += 1;
      }
    }
  }

  update(event) {
    if (this.world.authoritative) {
      this.tick = event.tick;
      this.event = event;
    }

    this.world.update(event, (id, tank) => {
      this.score[id] += 1;

      if (this.world.authoritative) {
        const newTank = this.world.placeTank(tank);
        this.addTank(newTank);
      }
    });
  }

  handleEvent(netMessage) {
    switch (netMessage.type) {
      case MessageType.MOVE:
        return this.handleMove(netMessage, this.world.move.bind(this.world));
      case MessageType.SHOOT:
        return this.handleMove(netMessage, this.world.shoot.bind(this.world));
      default:
        console.error('Unknown message', netMessage);
        return false;
    }
  }

  handleMove(netMessage, method) {
    const tankMove = netMessage.data;
    const id = netMessage.id;

    this.addAck(id, tankMove.moveId);

    return method(id, tankMove.direction);
  }

  addAck(id, moveId) {
    this.ack[id] = Math.max(moveId, this.ack[id]);
  }

  addUnackedMessage(netMessage) {
    this.unackedMessages.push(netMessage);
  }

  sync(id, match) {
    this.score = match.score;
    this.ack = match.ack;
    this.tick = match.tick;
    this.world.sync(match.world);

    this.unackedMessages = this.unackedMessages.filter(move => {
      if (this.ack[id] === undefined) {
        return true;
      }

      return compareTick(move.data.moveId, this.ack[id]) > 0;
    });

    for (let netMessage of this.unackedMessages) {
      switch (netMessage.type) {
        case MessageType.MOVE:
          const move = netMessage.data;
          this.world.move(id, move.direction);
          break;
        case MessageType.SHOOT:
          // newBullets = this.replaceEntity(newBullets, this.findBullet(id));
          break;
      }
    }
  }

  static create(data) {
    return new Match(
      data.id,
      data.users,
      World.create(data.world),
      data.score,
      data.tick,
      data.event,
      data.ack
    );
  }

  copy() {
    return Match.create(JSON.parse(JSON.stringify(this)));
  }

}
