
export default {
  start(server) {
    return server.start();
  },

  onConnected(server, cb) {
    return server.onConnected(cb);
  },
};
