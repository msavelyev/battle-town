import { freeze } from '@Lib/tanks/lib/util/immutable.js';

export default freeze({
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  CLIENT_MESSAGE: 'client-message',
  REVIVE_BLOCKS: 'revive-blocks',
});
