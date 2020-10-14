import protocol from '../../../../lib/src/lang/protocol.js';
import NetClient from './NetClient.js';

export default function() {
  return protocol.implement(NetClient, {
    send() { },
    sendMessage() { },
    onMessage() { },
    on() { },
    off() { },
    disconnect() { }
  });
}
