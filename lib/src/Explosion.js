import Entity from './Entity.js';
import EntityType from './EntityType.js';
import {FPS} from './Ticker.js';

export default class Explosion extends Entity {

  constructor(id, position, tick) {
    super(id, EntityType.EXPLOSION, position, 2);

    this.tick = tick;
  }

  static get LIFETIME_TICKS() {
    return FPS;
  }

}
