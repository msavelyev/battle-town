const immutable = require('@Lib/tanks/lib/util/immutable.js');
const MatchState = require('@Lib/tanks/lib/data/MatchState.js');
const MessageType = require('@Lib/tanks/lib/proto/MessageType.js');
const compareTick = require('@Lib/tanks/lib/util/compareTick.js');
const World = require('@Lib/tanks/lib/data/World.js');
const Level = require('@Lib/tanks/lib/level/Level.js');

const dotenv = require('@Lib/tanks/lib/util/dotenv.js');
const analytics = require('@Lib/tanks/lib/util/analytics.js');
const ResetLevel = require('@Lib/tanks/lib/data/worldevent/ResetLevel.js');
const ResetTanks = require('@Lib/tanks/lib/data/worldevent/ResetTanks.js');
const Score = require('@Lib/tanks/lib/data/worldevent/Score.js');
const State = require('@Lib/tanks/lib/data/worldevent/State.js');
const TankRemove = require('@Lib/tanks/lib/data/worldevent/TankRemove.js');
const {WorldEventType} = require('@Lib/tanks/lib/data/worldevent/WorldEventType.js');

/**
 * @typedef Match
 * @property {MatchState} state
 * @property {Array.<User>} users
 * @property {World} world
 * @property {object} score
 * @property {number} tick
 * @property event
 * @property {object} ack
 * @property {number} stateSinceTick
 * @property {number} nextStateOnTick
 * @property {number} stateSpotlight
 * @property {Array} unackedMessages
 */

/**
 * @typedef User
 * @property {string} id
 * @property {number} score
 * @property {string} name
 */


/**
 *
 * @param {string} id
 * @param {World} world
 * @param {number} tick
 * @returns {Match}
 */
function create(id, world, tick) {
  const state = MatchState.state.PREPARE;
  return immutable.freeze({
    state: state,

    users: immutable.array(),
    world: world,

    score: immutable.obj(),
    tick: tick,
    event: null,
    ack: immutable.obj(),

    stateSinceTick: tick,
    nextStateOnTick: MatchState.nextStateOnTick(state, tick),
    stateSpotlight: null,

    unackedMessages: immutable.array(),
  });
}
module.exports.create = create;

/**
 * @modifying
 *
 * @param {Match} match
 * @param {string} id
 * @param {Array} updates
 * @returns {Match}
 */
function removeTank(match, id, updates) {
  match = immutable.copy(match, {
    world: World.removeTank(match.world, id),
    score: immutable.withoutKey(match.score, id),
    ack: immutable.withoutKey(match.ack, id),
    users: immutable.filter(match.users, user => user.id !== id)
  });

  updates.push(Score.create(match.score));
  updates.push(TankRemove.create(id));

  return match;
}
module.exports.removeTank = removeTank;

/**
 * @callback MatchOnKill
 * @param {Match} match
 * @param event
 * @param {string} killerId
 * @param {string} victimId
 * @param {Array} updates
 * @returns {Match}
 */

/**
 * @callback BeforeWorld
 * @param {Match} match
 * @param event
 * @param {Array} updates
 * @returns {Match}
 */
/**
 * @modifying
 *
 * @param {Match} match
 * @param event
 * @param {BeforeWorld} beforeWorld
 * @param {MatchOnKill} onKill
 * @param {Array} updates
 * @returns {Match}
 */
function update(match, event, beforeWorld, onKill, updates) {
  match = beforeWorld(match, event, updates);

  const world = World.update(match.world, event, (killer, victim) => {
    match = onKill(match, event, killer, victim, updates);
    return match.world;
  }, updates);

  return immutable.copy(match, {
    world
  });
}
module.exports.update = update;

/**
 * @selector
 *
 * @param {Match} match
 * @param {string} id
 * @returns {User} user
 */
function findUser(match, id) {
  return match.users.find(user => user.id === id);
}
module.exports.findUser = findUser;

/**
 * @modifying
 *
 * @param {Match} match
 * @param netMessage
 * @param {Array} updates
 * @returns {Match}
 */
function handleEvent(match, netMessage, updates) {
  switch (netMessage.type) {
    case MessageType.MOVE:
      return handleMove(match, netMessage, World.move, updates);
    case MessageType.SHOOT:
      return handleMove(match, netMessage, World.shoot, updates);
    default:
      console.error('Unknown message', netMessage);
      return match;
  }
}
module.exports.handleEvent = handleEvent;

/**
 * @modifying
 *
 * @param {Match} match
 * @param netMessage
 * @param {Function} method
 * @param {Array} updates
 * @returns {Match}
 */
function handleMove(match, netMessage, method, updates) {
  const tankMove = netMessage.data;
  const id = netMessage.id;

  match = addAck(match, id, tankMove.moveId);

  if (netMessage.type === MessageType.MOVE && !MatchState.movable(match.state)) {
    return match;
  }

  if (netMessage.type === MessageType.SHOOT && !MatchState.shootable(match.state)) {
    return match;
  }

  match = immutable.copy(match, {
    world: method(match.world, id, tankMove.direction, updates)
  });

  return match;
}

/**
 * @modifying
 *
 * @param {Match} match
 * @param {string} id
 * @param {number} moveId
 * @returns {Match}
 */
function addAck(match, id, moveId) {
  const oldAck = match.ack[id] || -1;

  return immutable.copy(match, {
    ack: immutable.copy(match.ack, {
      [id]: Math.max(moveId, oldAck)
    }),
  });
}

/**
 * @modifying,
 *
 * @param {Match} match
 * @param netMessage
 */
function addUnackedMessage(match, netMessage) {
  return immutable.copy(match, {
    unackedMessages: immutable.push(match.unackedMessages, netMessage)
  });
}
module.exports.addUnackedMessage = addUnackedMessage;

/**
 * @modifying
 *
 * @param {Match} match
 * @param {string} id
 * @param tickData
 * @returns {Match}
 */
function sync(match, id, tickData) {
  match = immutable.copy(match, {
    tick: tickData.tick,
    ack: tickData.ack,
  });

  match = immutable.copy(match, {
    unackedMessages: immutable.filter(match.unackedMessages, move => {
      if (match.ack[id] === undefined) {
        return true;
      }

      return compareTick(move.data.moveId, match.ack[id]) > 0;
    })
  })

  for (let data of tickData.updates) {
    switch (data.type) {
      case WorldEventType.STATE:
        match = State.toMatch(data, match);
        trackMatchTransition(match, id);
        break;
      case WorldEventType.SCORE:
        match = immutable.copy(match, {
          score: data.score,
        });
        break;
      case WorldEventType.USER_CONNECT:
        match = immutable.copy(match, {
          users: immutable.push(match.users, {
            id: data.id,
            name: data.name,
          }),
          score: immutable.copy(match.score, {
            [data.id]: 0
          }),
        });
        break;
      case WorldEventType.USER_DISCONNECT:
        match = immutable.copy(match, {
          users: immutable.filter(match.users, user => user.id !== data.id),
          score: immutable.withoutKey(match.sscore, data.id),
        });
        break;
      default:
        break;
    }
  }

  match = immutable.copy(match, {
    world: World.sync(match.world, tickData.updates, id, match.unackedMessages)
  })

  return match;
}
module.exports.sync = sync;

/**
 * @sideeffects
 *
 * @param {Match} match
 * @param {string} id
 */
function trackMatchTransition(match, id) {
  if (match.state === MatchState.state.SCORE && match.stateSpotlight === id) {
    analytics.log('MATCH_SCORE');
  } else if (match.state === MatchState.state.FINISHED && match.stateSpotlight === id) {
    analytics.log('MATCH_WIN');
  } else if (match.state === MatchState.state.FINISHED && match.stateSpotlight !== id) {
    analytics.log('MATCH_LOSS');
  }
}

/**
 * @modifying
 *
 * @param {Match} match
 * @param {MatchState} state
 * @returns {Match}
 */
function setJustState(match, state) {
  return immutable.copy(match, {
    state,
  });
}

/**
 * @modifying
 *
 * @param {Match} match
 * @param event
 * @param {Array} updates
 * @returns {Match}
 */
function transitionState(match, event, updates) {
  switch (match.state) {
    case MatchState.state.PREPARE:
      match = setJustState(match, MatchState.state.READY);
      break;
    case MatchState.state.READY:
      match = setJustState(match, MatchState.state.PLAY);
      break;
    case MatchState.state.PLAY:
      if (maxScore(match) === dotenv.SETTINGS.SCORE_TO_WIN) {
        match = setWinner(match, winner(match).id, event.tick);
        return match;
      }
      match = setJustState(match, MatchState.state.SCORE);
      break;
    case MatchState.state.SCORE:
      match = immutable.copy(match, {
        world: World.resetLevel(match.world, Level.generate(Level.choose()))
      });
      match = immutable.copy(match, {
        world: World.resetTanks(match.world, match)
      });
      updates.push(ResetLevel.create(match.world.blocks));
      updates.push(ResetTanks.create(match.world.tanks));

      match = setJustState(match, MatchState.state.READY);
      break;
    case MatchState.state.FINISHED:
      return match;
  }

  return setState(match, match.state, event.tick);
}
module.exports.transitionState = transitionState;

/**
 * @modifying
 *
 * @param {Match} match
 * @param {User} user
 * @param {number} tick
 * @param {Array} updates
 * @returns {Match}
 */
function addUser(match, user, tick, updates) {
  return immutable.copy(match, {
    users: immutable.push(match.users, user),
    score: immutable.copy(match.score, {
      [user.id]: 0
    }),
    world: World.newTank(match.world, tick, user, updates)
  });
}
module.exports.addUser = addUser;

/**
 * @selector
 *
 * @param {Match} match
 * @returns {number}
 */
function maxScore(match) {
  return winner(match).score;
}

/**
 * @selector
 *
 * @param {Match} match
 * @returns {{score: number, id: string}} user
 */
function winner(match) {
  return Object.entries(match.score)
    .map(entry => ({id: entry[0], score: entry[1]}))
    .sort((a, b) => b.score - a.score)
    [0];
}
module.exports.winner = winner;

/**
 * @selector
 *
 * @param {Match} match
 * @returns boolean
 */
function finished(match) {
  return match.state === MatchState.state.FINISHED
    && match.nextStateOnTick <= match.tick;
}
module.exports.finished = finished;

/**
 * @modifying
 *
 * @param {Match} match
 * @param {string} winner
 * @param {number} tick
 * @returns {Match}
 */
function setWinner(match, winner, tick) {
  return immutable.copy(match, {
    state: MatchState.state.FINISHED,
    stateSpotlight: winner,
    stateSinceTick: tick,
    nextStateOnTick: MatchState.nextStateOnTick(match.state, tick),
  });
}
module.exports.setWinner = setWinner;

/**
 * @modifying
 *
 * @param {Match} match
 * @param {MatchState} state
 * @param {number} tick
 * @returns {Match}
 */
function setState(match, state, tick) {
  return immutable.copy(match, {
    state: state,
    stateSpotlight: null,
    stateSinceTick: tick,
    nextStateOnTick: MatchState.nextStateOnTick(state, tick),
  })
}
module.exports.setState = setState;

/**
 * @modifying
 *
 * @param {Match} match
 * @returns {Match}
 */
function resetScore(match) {
  for (let id of Object.keys(match.score)) {
    match = immutable.copy(match, {
      score: immutable.copy(match.score, {
        [id]: 0
      })
    });
  }

  return match;
}
module.exports.resetScore = resetScore;

/**
 * @modifying
 *
 * @param {Match} match
 * @param {Array.<Block>} blocks
 * @returns {Match}
 */
function resetLevel(match, blocks) {
  return immutable.copy(match, {
    world: World.resetLevel(match.world, blocks)
  });
}
module.exports.resetLevel = resetLevel;

/**
 * @modifying
 *
 * @param {Match} match
 * @param {string} id
 * @returns {Match}
 */
function increaseScore(match, id) {
  return immutable.copy(match, {
    score: immutable.copy(match.score, {
      [id]: match.score[id] + 1
    }),
  });
}
module.exports.increaseScore = increaseScore;
