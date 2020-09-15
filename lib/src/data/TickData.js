
export default class TickData {
  constructor(tick, updates, ack) {
    this.tick = tick;
    this.updates = updates;
    this.ack = ack;
  }
}
