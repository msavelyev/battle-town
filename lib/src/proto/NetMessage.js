
export default class NetMessage {
  constructor(id, tick, type, data) {
    this.id = id;
    this.tick = tick; // TODO unused
    this.type = type;
    this.data = data;
  }

}
