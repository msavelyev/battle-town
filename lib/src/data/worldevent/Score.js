import WorldEvent from './WorldEvent.js';
import WorldEventType from './WorldEventType.js';

export default class Score extends WorldEvent {
  constructor(score) {
    super(WorldEventType.SCORE);
    this.score = score;
  }
}
