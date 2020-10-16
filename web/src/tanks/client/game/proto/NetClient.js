
export default {
  on(netClient, name, cb) {
    return netClient.on(name, cb);
  },

  connect(netClient) {
    return netClient.connect();
  },

  disconnect(netClient) {
    return netClient.disconnect();
  },

  sendMessage(netClient, messageType, payload) {
    return netClient.sendMessage(messageType, payload);
  },

  sendNetMessage(netClient, netMessage) {
    return netClient.sendNetMessage(netMessage);
  },

  sendEvent(netClient, eventType, payload) {
    return netClient.sendEvent(eventType, payload);
  },

}
