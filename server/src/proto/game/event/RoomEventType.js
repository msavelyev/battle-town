import { freeze } from '../../../../../lib/src/util/immutable.js';

export default freeze({
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  CLIENT_MESSAGE: 'client-message',
  REVIVE_BLOCKS: 'revive-blocks',
});
