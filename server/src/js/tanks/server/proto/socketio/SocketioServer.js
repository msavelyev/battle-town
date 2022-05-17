import IO from 'socket.io';
import protocol from 'Lib/tanks/lib/lang/protocol.js';
import netServer from 'Server/tanks/server/proto/base/NetServer.js';
import SocketioClient from 'Server/tanks/server/proto/socketio/SocketioClient.js';

export default function(server) {
  const io = IO(server);

  return protocol.implement(netServer, {
    start() {

    },

    onConnected(cb) {
      return io.on('connection', (socket) => {
        cb(SocketioClient(socket));
      });
    }
  });
}
