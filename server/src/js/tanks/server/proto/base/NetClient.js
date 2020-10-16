
export default {
  on(client, eventType, cb) {
    return client.on(eventType, cb);
  },

  off(client, eventType, cb) {
    return client.off(eventType, cb);
  },

  disconnect(client) {
    return client.disconnect();
  },

  sendMessage(client, netMessage) {
    return client.sendMessage(netMessage);
  },

  onMessage(client, messageType, cb) {
    return client.onMessage(messageType, cb);
  },

  send(client, eventType, payload) {
    return client.send(eventType, payload);
  },
};
