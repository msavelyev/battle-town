import protocol from 'Lib/tanks/lib/lang/protocol.js';
import NetClient from 'Server/tanks/server/proto/base/NetClient.js';

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
