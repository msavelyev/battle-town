function flush(netUsage) {
  const now = new Date();
  const diff = now - netUsage.lastDate;

  if (diff > 1000) {
    netUsage.last = netUsage.current;
    netUsage.lastDate = now;
    netUsage.current = { read: 0, write: 0 };
  }
}

export default {
  create() {
    return {
      lastDate: new Date(),
      last: { read: 0, write: 0 },
      current: { read: 0, write: 0 },
    };
  },

  read(netUsage, data) {
    if (data) {
      netUsage.current.read += JSON.stringify(data).length;
    }
    flush(netUsage);
  },

  write(netUsage, data) {
    if (data) {
      netUsage.current.write += JSON.stringify(data).length;
    }
    flush(netUsage);
  },

};
