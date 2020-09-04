import Block from './Block.js';
import Bullet from './Bullet.js';
import Tank from './Tank.js';
import randomInt from './randomInt.js';
import Point from './Point.js';
import Direction from './Direction.js';
import Entity from './Entity.js';
import MessageType from './proto/MessageType.js';
import TankMove from './event/TankMove.js';

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

    this.lastMove = -1;

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

  startMoving(id, direction, position) {
    const tank = this.findTank(id);
    return tank.start(direction, position);
  }

  stopMoving(id, direction, position) {
    const tank = this.findTank(id);
    tank.stop(direction, position);
    return true;
  }

  findTank(id) {
    return this.tanks.find(tank => tank.id === id);
  }

  findBullet(id) {
    return this.bullets.find(bullet => bullet.id === id);
  }

  shoot(id, direction, position) {
    if (this.bullets.find(bullet => bullet.id === id)) {
      return false;
    }

    if (!position) {
      const tank = this.findTank(id);
      position = tank.position;
    }
    const bullet = new Bullet(id, direction, position);
    this.bullets.push(bullet);
    return true;
  }

  collides(entity) {
    let result = false;
    for (let block of this.blocks) {
      if (block.collides(entity)) {
        result = true;
      }
    }

    for (let tank of this.tanks) {
      if (entity.id === tank.id) {
        continue;
      }
      if (tank.collides(entity)) {
        if (entity instanceof Bullet) {
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
    this.tick = event.tick;
    this.event = event;

    let deleted = false;
    for (let i = 0; i < this.bullets.length; i++) {
      const bullet = this.bullets[i];
      bullet.update(event);

      if (this.collides(bullet)) {
        delete this.bullets[i];
        deleted = true;
      }
    }

    for (let tank of this.tanks) {
      tank.update(event, this);
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

    if (this.lastMove > this.ack[id]) {
      console.log('lastMove', this.lastMove, 'ack', this.ack[id]);
      this.tanks = this.replaceEntity(world.tanks, this.findTank(id));
      this.bullets = this.replaceEntity(world.bullets, this.findBullet(id));
    } else {
      this.tanks = world.tanks;
      this.bullets = world.bullets;
    }
  }

  replaceEntity(entities, byWhat) {
    if (!entities.find(byWhat.id)) {
      entities.push(byWhat);
      return entities;
    }

    return entities.map(entity => {
      if (entity.id === id) {
        const foundEntity = findById(id);
        console.log('predicted entity', foundEntity);
        return foundEntity || entity;
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
      data.blocks.map(block => Block.create(block)),
      data.tanks.map(tank => Tank.create(tank)),
      data.bullets.map(bullet => Bullet.create(bullet)),
      data.score,
      data.tick,
      data.event,
      data.ack
    )
  }

  copy() {
    return World.create(JSON.parse(JSON.stringify(this)));
  }

  handleEvent(netMessage) {
    switch (netMessage.type) {
      case MessageType.START_MOVING:
        return this.handleMove(netMessage, this.startMoving.bind(this));
      case MessageType.STOP_MOVING:
        return this.handleMove(netMessage, this.stopMoving.bind(this));
      case MessageType.SHOOT:
        return this.handleMove(netMessage, this.shoot.bind(this));
      default:
        console.error('Unknown message', netMessage);
        return false;
    }
  }

  handleMove(netMessage, method) {
    const tankMove = TankMove.create(netMessage.data);
    const id = netMessage.id;

    this.addAck(id, tankMove.moveId);

    return method(id, tankMove.direction, tankMove.position);
  }

  addAck(id, moveId) {
    this.ack[id] = moveId;
  }

}
