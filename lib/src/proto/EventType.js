import freeze from '../util/freeze.js';

export default freeze({
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  MESSAGE: 'message',
  AUTH: 'auth',
  AUTH_ACK: 'auth-ack',
  MATCH_FOUND: 'match-found',
});
