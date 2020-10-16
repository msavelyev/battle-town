const {freeze} = require('@Lib/tanks/lib/util/immutable.js');

module.exports = freeze({
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  MESSAGE: 'message',
  AUTH: 'auth',
  AUTH_ACK: 'auth-ack',
  MATCH_FOUND: 'match-found',
});
