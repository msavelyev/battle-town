
export default class NetUsage {

  constructor() {
    this.lastDate = new Date();

    this.last = { read: 0, write: 0 };
    this.current = { read: 0, write: 0 };
  }

  read(data) {
    if (data) {
      this.current.read += JSON.stringify(data).length;
    }
    this.flush();
  }

  write(data) {
    if (data) {
      this.current.write += JSON.stringify(data).length;
    }
    this.flush();
  }

  flush() {
    const now = new Date();
    const diff = now - this.lastDate;

    if (diff > 1000) {
      this.last = this.current;
      this.lastDate = now;
      this.current = { read: 0, write: 0 };
    }
  }

}
