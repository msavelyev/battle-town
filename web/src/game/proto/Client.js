import MessageType from '../../../../lib/src/proto/MessageType.js';
import EventType from '../../../../lib/src/proto/EventType.js';
import NetClient from './NetClient.js';

function create(netClient) {
  const client = {
    netClient,
    callbacks: {}
  };

  NetClient.on(netClient, EventType.MESSAGE, handleMessage.bind(null, client));

  return client;
}

function handleMessage(client, netMessage) {
  const messageType = netMessage.type;
  if (client.callbacks[messageType]) {
    client.callbacks[messageType](netMessage.data);
  }
}

function connect(client) {
  NetClient.connect(client.netClient);
}

function disconnect(client) {
  NetClient.disconnect(client.netClient);
}

function on(client, eventType, cb) {
  NetClient.on(client.netClient, eventType, cb);
}

function ping(client) {
  NetClient.sendMessage(client.netClient, MessageType.PING);
}

function onMessage(client, messageType, cb) {
  if (!cb) {
    delete client.callbacks[messageType];
  } else {
    client.callbacks[messageType] = cb;
  }
}

function sendNetMessage(client, netMessage) {
  NetClient.sendNetMessage(client.netClient, netMessage);
}

function sendEvent(client, eventType, payload) {
  NetClient.sendEvent(client.netClient, eventType, payload);
}

export default {
  create,
  connect,
  disconnect,
  on,
  ping,
  onMessage,
  sendNetMessage,
  sendEvent,
};
