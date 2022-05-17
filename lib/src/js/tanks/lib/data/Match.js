import * as immutable from 'Lib/tanks/lib/util/immutable.js';
import * as MatchState from 'Lib/tanks/lib/data/MatchState.js';
import MessageType from 'Lib/tanks/lib/proto/MessageType.js';
import compareTick from 'Lib/tanks/lib/util/compareTick.js';
import * as World from 'Lib/tanks/lib/data/World.js';
import Level from 'Lib/tanks/lib/level/Level.js';

import * as dotenv from 'Lib/tanks/lib/util/dotenv.js';
import analytics from 'Lib/tanks/lib/util/analytics.js';
import * as ResetLevel from 'Lib/tanks/lib/data/worldevent/ResetLevel.js';
import * as ResetTanks from 'Lib/tanks/lib/data/worldevent/ResetTanks.js';
import * as Score from 'Lib/tanks/lib/data/worldevent/Score.js';
import * as State from 'Lib/tanks/lib/data/worldevent/State.js';
import * as TankRemove from 'Lib/tanks/lib/data/worldevent/TankRemove.js';
import {WorldEventType} from 'Lib/tanks/lib/data/worldevent/WorldEventType.js';

import * as returnResult from 'Lib/tanks/lib/data/returnResult.js';

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
export function create(id, world, tick) {
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

/**
 * @modifying
 *
 * @param {Match} match
 * @param {string} id
 * @param {Array} updates
 * @returns {Match}
 */
export function removeTank(match, id, updates) {
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
export function update(match, event, beforeWorld, onKill, updates) {
  match = beforeWorld(match, event, updates);

  const world = World.update(match.world, event, (killer, victim) => {
    match = onKill(match, event, killer, victim, updates);
    return match.world;
  }, updates);

  return immutable.copy(match, {
    world
  });
}

/**
 * @selector
 *
 * @param {Match} match
 * @param {string} id
 * @returns {User} user
 */
export function findUser(match, id) {
  return match.users.find(user => user.id === id);
}

/**
 * @modifying
 *
 * @param {Match} match
 * @param netMessage
 * @param {Array} updates
 * @returns {Match}
 */
export function handleEvent(match, netMessage, updates) {
  switch (netMessage.type) {
    case MessageType.MOVE:
      return handleMove(match, netMessage, World.move, updates);
    case MessageType.SHOOT:
      return handleMove(match, netMessage, World.shoot, updates);
    default:
      console.error('Unknown message', netMessage);
      return returnResult.modifiedUnsuccessfully(match);
  }
}

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
    return returnResult.modifiedUnsuccessfully(match);
  }

  if (netMessage.type === MessageType.SHOOT && !MatchState.shootable(match.state)) {
    return returnResult.modifiedUnsuccessfully(match);
  }

  const worldResult = method(match.world, id, tankMove.direction, updates);
  if (returnResult.isSuccessful(worldResult)) {
    match = immutable.copy(match, {
      world: returnResult.getResult(worldResult),
    });
    return returnResult.modifiedSuccessfully(match);
  }

  return returnResult.modifiedUnsuccessfully(match);
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
export function addUnackedMessage(match, netMessage) {
  return immutable.copy(match, {
    unackedMessages: immutable.push(match.unackedMessages, netMessage)
  });
}

/**
 * @modifying
 *
 * @param {Match} match
 * @param {string} id
 * @param tickData
 * @returns {Match}
 */
export function sync(match, id, tickData) {
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
export function transitionState(match, event, updates) {
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

/**
 * @modifying
 *
 * @param {Match} match
 * @param {User} user
 * @param {number} tick
 * @param {Array} updates
 * @returns {Match}
 */
export function addUser(match, user, tick, updates) {
  return immutable.copy(match, {
    users: immutable.push(match.users, user),
    score: immutable.copy(match.score, {
      [user.id]: 0
    }),
    world: World.newTank(match.world, tick, user, updates)
  });
}

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
export function winner(match) {
  return Object.entries(match.score)
    .map(entry => ({id: entry[0], score: entry[1]}))
    .sort((a, b) => b.score - a.score)
    [0];
}

/**
 * @selector
 *
 * @param {Match} match
 * @returns boolean
 */
export function finished(match) {
  return match.state === MatchState.state.FINISHED
    && match.nextStateOnTick <= match.tick;
}

/**
 * @modifying
 *
 * @param {Match} match
 * @param {string} winner
 * @param {number} tick
 * @returns {Match}
 */
export function setWinner(match, winner, tick) {
  return immutable.copy(match, {
    state: MatchState.state.FINISHED,
    stateSpotlight: winner,
    stateSinceTick: tick,
    nextStateOnTick: MatchState.nextStateOnTick(match.state, tick),
  });
}

/**
 * @modifying
 *
 * @param {Match} match
 * @param {MatchState} state
 * @param {number} tick
 * @returns {Match}
 */
export function setState(match, state, tick) {
  return immutable.copy(match, {
    state: state,
    stateSpotlight: null,
    stateSinceTick: tick,
    nextStateOnTick: MatchState.nextStateOnTick(state, tick),
  })
}

/**
 * @modifying
 *
 * @param {Match} match
 * @returns {Match}
 */
export function resetScore(match) {
  for (let id of Object.keys(match.score)) {
    match = immutable.copy(match, {
      score: immutable.copy(match.score, {
        [id]: 0
      })
    });
  }

  return match;
}

/**
 * @modifying
 *
 * @param {Match} match
 * @param {Array.<Block>} blocks
 * @returns {Match}
 */
export function resetLevel(match, blocks) {
  return immutable.copy(match, {
    world: World.resetLevel(match.world, blocks)
  });
}

/**
 * @modifying
 *
 * @param {Match} match
 * @param {string} id
 * @returns {Match}
 */
export function increaseScore(match, id) {
  return immutable.copy(match, {
    score: immutable.copy(match.score, {
      [id]: match.score[id] + 1
    }),
  });
}
