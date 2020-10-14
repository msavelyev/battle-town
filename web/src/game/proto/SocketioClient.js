import io from 'socket.io-client';
import protocol from '../../../../lib/src/lang/protocol.js';
import NetClient from './NetClient.js';
import NetMessage from '../../../../lib/src/proto/NetMessage.js';
import EventType from '../../../../lib/src/proto/EventType.js';
import {SETTINGS} from '../../../../lib/src/util/dotenv.js';
import NetUsage from './NetUsage.js';

function sendNetMessage(netClient, netMessage) {
  sendEvent(netClient, EventType.MESSAGE, netMessage);
}

function sendEvent(netClient, eventType, payload) {
  NetUsage.write(netClient.usage, payload);
  netClient.socket.emit(eventType, payload);
}

export default function() {
  const socket = io(SETTINGS.SERVER_WS_HOST, { autoConnect: false });
  const usage = NetUsage.create();

  const netClient = protocol.implement(NetClient, {
    usage,
    socket,

    on(name, cb) {
      if (cb) {
        socket.on(name, msg => {
          NetUsage.read(usage, msg);

          cb(msg);
        });
      } else {
        socket.off(name);
      }
    },

    sendMessage(messageType, data) {
      sendNetMessage(netClient, NetMessage(null, messageType, data));
    },

    sendNetMessage(netMessage) {
      return sendNetMessage(netClient, netMessage);
    },

    sendEvent(eventType, payload) {
      return sendEvent(netClient, eventType, payload);
    },

    connect() {
      return socket.connect();
    },

    disconnect() {
      return socket.disconnect();
    },
  });
  return netClient;
};
