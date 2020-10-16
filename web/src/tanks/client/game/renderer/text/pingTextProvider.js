import MessageType from '../../../../../../../lib/src/tanks/lib/proto/MessageType.js';
import Client from '../../proto/Client.js';

export default function(client) {
  let latency;
  let lastPing = new Date();
  let timeout;

  function ping() {
    lastPing = new Date();
    Client.ping(client);
  }

  Client.onMessage(client, MessageType.PING, function pong() {
    latency = new Date() - lastPing;
    timeout = setTimeout(ping, 1000);
  });

  ping();
  
  return () => {
    return 'ping: ' + latency + 'ms';
  };
}
