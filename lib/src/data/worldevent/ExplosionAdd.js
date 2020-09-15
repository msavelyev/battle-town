import WorldEvent from './WorldEvent.js';
import WorldEventType from './WorldEventType.js';

export default class ExplosionAdd extends WorldEvent {

  constructor(id, position, tick) {
    super(WorldEventType.EXPLOSION_ADD);
    this.id = id;
    this.position = position;
    this.tick = tick;
  }

  static fromExplosion(explosion) {
    return new ExplosionAdd(
      explosion.id,
      explosion.position,
      explosion.tick
    );
  }

}
