import io from 'socket.io-client';
import protocol from '@Lib/tanks/lib/lang/protocol.js';
import NetClient from '@Client/tanks/client/game/proto/NetClient.js';
import NetMessage from '@Lib/tanks/lib/proto/NetMessage.js';
import EventType from '@Lib/tanks/lib/proto/EventType.js';
import dotenv from '@Lib/tanks/lib/util/dotenv.js';
import NetUsage from '@Client/tanks/client/game/proto/NetUsage.js';

function sendNetMessage(netClient, netMessage) {
  sendEvent(netClient, EventType.MESSAGE, netMessage);
}

function sendEvent(netClient, eventType, payload) {
  NetUsage.write(netClient.usage, payload);
  netClient.socket.emit(eventType, payload);
}

export default function() {
  const socket = io(dotenv.SETTINGS.SERVER_WS_HOST, { autoConnect: false });
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
