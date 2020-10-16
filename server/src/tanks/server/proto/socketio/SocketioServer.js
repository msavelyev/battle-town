import IO from 'socket.io';
import protocol from '../../../../../../lib/src/tanks/lib/lang/protocol.js';
import netServer from '../base/NetServer.js';
import SocketioClient from './SocketioClient.js';

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
