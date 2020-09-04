import Block from './Block.js';
import Bullet from './Bullet.js';
import Tank from './Tank.js';
import randomInt from './randomInt.js';
import Point from './Point.js';
import Direction from './Direction.js';
import Entity from './Entity.js';
import MessageType from './proto/MessageType.js';
import EntityType from './EntityType.js';

export default class World {

  constructor(id, width, height, blocks, tanks, bullets, score, tick, event, ack) {
    this.authoritative = true;

    this.id = id;
    this.width = width;
    this.height = height;
    this.blocks = blocks;
    this.tanks = tanks;
    this.bullets = bullets;
    this.score = score;
    this.tick = tick;
    this.event = event;
    this.ack = ack;

    this.unackedMessages = [];

    for (let tank of this.tanks) {
      if (!this.score[tank.id]) {
        this.score[tank.id] = 0;
      }
    }
  }

  addTank(tank) {
    this.tanks.push(tank);
    if (!this.score[tank.id]) {
      this.score[tank.id] = 0;
    }
  }

  removeTank(id, cleanScore) {
    this.tanks = this.tanks.filter(tank => tank.id !== id);
    if (cleanScore) {
      delete this.score[id];
    }
  }

  move(id, direction) {
    const tank = this.findTank(id);
    return Tank.move(tank, this, direction);
  }

  findTank(id) {
    return this.tanks.find(tank => tank.id === id);
  }

  findBullet(id) {
    return this.bullets.find(bullet => bullet.id === id);
  }

  shoot(id, direction) {
    if (this.bullets.find(bullet => bullet.id === id)) {
      return false;
    }

    const tank = this.findTank(id);
    const bullet = new Bullet(id, direction, tank.position);
    this.bullets.push(bullet);
    return true;
  }

  collides(entity) {
    let result = false;
    for (let block of this.blocks) {
      if (Block.collides(block, entity)) {
        if (entity.entityType !== EntityType.BULLET) {
          return true;
        }
        result = true;
      }
    }

    for (let tank of this.tanks) {
      if (entity.id === tank.id) {
        continue;
      }
      if (Entity.collides(tank, entity)) {
        if (entity.entityType !== EntityType.BULLET) {
          return true;
        }

        if (entity.entityType === EntityType.BULLET) {
          this.tanks = this.tanks.filter(t => t !== tank);
          this.score[entity.id] += 1;

          if (this.authoritative) {
            const newTank = this.placeTank(tank);
            this.addTank(newTank);
          }
        }
        result = true;
      }
    }

    return result;
  }

  update(event) {
    if (this.authoritative) {
      this.tick = event.tick;
      this.event = event;
    }

    let deleted = false;
    for (let i = 0; i < this.bullets.length; i++) {
      const bullet = this.bullets[i];
      Bullet.update(bullet, event);

      if (this.collides(bullet)) {
        delete this.bullets[i];
        deleted = true;
      }
    }

    if (deleted) {
      this.bullets = this.bullets.filter(bullet => !!bullet);
    }
  }

  placeTank(tank) {
    let newTank = null;

    do {
      const x = randomInt(0, this.width / Entity.BLOCK_SIZE - 1);
      const y = randomInt(0, this.height / Entity.BLOCK_SIZE - 1);

      newTank = new Tank(tank.id, new Point(x, y), tank.color, Direction.UP, false);
    } while(this.collides(newTank));
    console.log('placing tank', newTank.id, 'at tick', this.tick);

    return newTank;
  }

  sync(id, world) {
    this.blocks = world.blocks;
    this.score = world.score;
    this.ack = world.ack;
    this.tick = world.tick;
    this.tanks = world.tanks;
    let newBullets = world.bullets;

    this.unackedMessages = this.unackedMessages.filter(move => move.data.moveId > this.ack[id]);

    for (let netMessage of this.unackedMessages) {
      switch (netMessage.type) {
        case MessageType.MOVE:
          const move = netMessage.data;
          this.move(id, move.direction);
          break;
        case MessageType.SHOOT:
          // newBullets = this.replaceEntity(newBullets, this.findBullet(id));
          break;
      }
    }

    this.bullets = newBullets;
  }

  replaceEntity(entities, byWhat) {
    if (!byWhat) {
      return entities;
    }

    if (!entities.find(entity => entity.id === byWhat.id)) {
      entities.push(byWhat);
      return entities;
    }

    return entities.map(entity => {
      if (entity.id === byWhat.id) {
        return byWhat;
      } else {
        return entity;
      }
    });
  }

  static create(data) {
    return new World(
      data.id,
      data.width,
      data.height,
      data.blocks,
      data.tanks,
      data.bullets,
      data.score,
      data.tick,
      data.event,
      data.ack
    )
  }

  toJSON() {
    return {
      id: this.id,
      width: this.width,
      height: this.height,
      blocks: this.blocks,
      tanks: this.tanks,
      bullets: this.bullets,
      score: this.score,
      tick: this.tick,
      event: this.event,
      ack: this.ack,
    };
  }

  copy() {
    return World.create(JSON.parse(JSON.stringify(this)));
  }

  handleEvent(netMessage) {
    switch (netMessage.type) {
      case MessageType.MOVE:
        return this.handleMove(netMessage, this.move.bind(this));
      case MessageType.SHOOT:
        return this.handleMove(netMessage, this.shoot.bind(this));
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

}
