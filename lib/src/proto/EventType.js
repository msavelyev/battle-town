import { freeze } from '../util/immutable.js';

export default freeze({
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  MESSAGE: 'message',
  AUTH: 'auth',
  AUTH_ACK: 'auth-ack',
  MATCH_FOUND: 'match-found',
});
