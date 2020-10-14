import MessageType from '../../../../../lib/src/proto/MessageType.js';

export default function(client) {
  let latency;
  let lastPing = new Date();
  let timeout;

  function ping() {
    lastPing = new Date();
    client.ping();
  }

  client.onMessage(MessageType.PING, function pong() {
    latency = new Date() - lastPing;
    timeout = setTimeout(ping, 1000);
  });

  ping();
  
  return () => {
    return 'ping: ' + latency + 'ms';
  };
}
