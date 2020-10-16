import protocol from '@Lib/tanks/lib/lang/protocol.js';
import EventType from '@Lib/tanks/lib/proto/EventType.js';
import dotenv from '@Lib/tanks/lib/util/dotenv.js';
import rand from '@Lib/tanks/lib/util/rand.js';
import NetClient from '@Server/tanks/server/proto/base/NetClient.js';

/**
 *
 * @returns {any}
 */
function getLag() {
  return dotenv.SETTINGS.LAG;
}

function disconnect(client) {
  client.socket.disconnect();
}

function sendMessage(client, netMessage) {
  send(client, EventType.MESSAGE, netMessage);
}

function send(client, eventType, payload) {
  if (getLag()) {
    setTimeout(() => {
      sendImmediately(client, eventType, payload);
    }, lagValue());
  } else {
    sendImmediately(client, eventType, payload);
  }
}

function sendImmediately(client, eventType, payload) {
  client.socket.emit(eventType, payload);
}

function on(client, eventType, cb) {
  client.socket.on(eventType, cb);
}

function off(client, eventType, cb) {
  client.socket.off(eventType, cb);
}

function onMessage(client, messageType, cb) {
  if (cb) {
    client.callbacks[messageType] = delayedCb(messageType, cb);
  } else {
    delete client.callbacks[messageType];
  }
}

function delayedCb(name, cb) {
  return function() {
    if (getLag()) {
      setTimeout(() => {
        cb.apply(null, arguments);
      }, lagValue());
    } else {
      cb.apply(null, arguments);
    }
  };
}

function handleMessage(client, netMessage) {
  const messageType = netMessage.type;
  if (client.callbacks[messageType]) {
    client.callbacks[messageType](netMessage);
  }
}

function lagValue() {
  if (!getLag()) {
    return null;
  }

  if (getLag() === 'RANDOM') {
    return rand.randomInt(50, 150);
  }

  return dotenv.SETTINGS.LAG;
}

export default function(socket) {
  const client = protocol.implement(NetClient, {
    socket,
    callbacks: {},

    disconnect() {
      return disconnect(client);
    },

    sendMessage(netMessage) {
      return sendMessage(client, netMessage);
    },

    send(eventType, payload) {
      return send(client, eventType, payload);
    },

    onMessage(messageType, cb) {
      return onMessage(client, messageType, cb);
    },

    on(eventType, cb) {
      return on(client, eventType, cb);
    },

    off(eventType, cb) {
      return off(client, eventType, cb);
    },
  });

  on(client, EventType.MESSAGE, handleMessage.bind(null, client));
  return client;
}
