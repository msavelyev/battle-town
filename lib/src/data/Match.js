import * as MatchState from './MatchState.js';
import MessageType from '../proto/MessageType.js';
import compareTick from '../util/compareTick.js';
import * as World from './World.js';
import level from '../../../server/src/level.js';

import {SETTINGS} from '../util/dotenv.js';
import analytics from '../util/analytics.js';
import * as ResetLevel from './worldevent/ResetLevel.js';
import * as ResetTanks from './worldevent/ResetTanks.js';
import * as Score from './worldevent/Score.js';
import * as State from './worldevent/State.js';
import * as TankRemove from './worldevent/TankRemove.js';
import { WorldEventType } from './worldevent/WorldEventType.js';

export function create(id, world, tick) {
  const state = MatchState.state.PREPARE;
  return {
    state: state,

    users: [],
    world: world,

    score: {},
    tick: tick,
    event: null,
    ack: {},

    stateSinceTick: tick,
    nextStateOnTick: MatchState.nextStateOnTick(state, tick),
    stateSpotlight: null,

    unackedMessages: [],
  }
}

export function removeTank(match, id, updates) {
  World.removeTank(match.world, id);

  delete match.score[id];
  delete match.ack[id];

  match.users = match.users.filter(user => user.id !== id);

  updates.push(Score.create(match.score));
  updates.push(TankRemove.create(id));
}

export function update(match, event, beforeWorld, onKill) {
  const updates = [];

  beforeWorld(match, event, updates);

  const worldUpdates = World.update(match.world, event, (killer, victim) => {
    onKill(match, event, killer, victim, updates);
  });

  return updates.concat(worldUpdates);
}

export function findUser(match, id) {
  return match.users.find(user => user.id === id);
}

export function handleEvent(match, netMessage) {
  switch (netMessage.type) {
    case MessageType.MOVE:
      return handleMove(match, netMessage, World.move);
    case MessageType.SHOOT:
      return handleMove(match, netMessage, World.shoot);
    default:
      console.error('Unknown message', netMessage);
      return null;
  }
}

function handleMove(match, netMessage, method) {
  const tankMove = netMessage.data;
  const id = netMessage.id;

  addAck(match, id, tankMove.moveId);

  if (netMessage.type === MessageType.MOVE && !MatchState.movable(match.state)) {
    return null;
  }

  if (netMessage.type === MessageType.SHOOT && !MatchState.shootable(match.state)) {
    return null;
  }

  return method(match.world, id, tankMove.direction);
}

function addAck(match, id, moveId) {
  const oldAck = match.ack[id] || -1;
  match.ack[id] = Math.max(moveId, oldAck);
}

export function addUnackedMessage(match, netMessage) {
  match.unackedMessages.push(netMessage);
}

export function sync(match, id, tickData) {
  match.tick = tickData.tick;
  match.ack = tickData.ack;

  match.unackedMessages = match.unackedMessages.filter(move => {
    if (match.ack[id] === undefined) {
      return true;
    }

    return compareTick(move.data.moveId, match.ack[id]) > 0;
  });

  for (let data of tickData.updates) {
    switch (data.type) {
      case WorldEventType.STATE:
        State.toMatch(data, match);
        trackMatchTransition(match, id);
        break;
      case WorldEventType.SCORE:
        match.score = data.score;
        break;
      case WorldEventType.USER_CONNECT:
        match.users.push({
          id: data.id,
          name: data.name,
        });
        match.score[data.id] = 0;
        break;
      case WorldEventType.USER_DISCONNECT:
        match.users = match.users.filter(user => user.id !== data.id);
        delete match.score[data.id];
        break;
      default:
        break;
    }
  }

  World.sync(match.world, tickData.updates, id, match.unackedMessages);
}

function trackMatchTransition(match, id) {
  if (match.state === MatchState.state.SCORE && match.stateSpotlight === id) {
    analytics.log('MATCH_SCORE');
  } else if (match.state === MatchState.state.FINISHED && match.stateSpotlight === id) {
    analytics.log('MATCH_WIN');
  } else if (match.state === MatchState.state.FINISHED && match.stateSpotlight !== id) {
    analytics.log('MATCH_LOSS');
  }
}

export function transitionState(match, event, updates) {
  switch (match.state) {
    case MatchState.state.PREPARE:
      match.state = MatchState.state.READY;
      break;
    case MatchState.state.READY:
      match.state = MatchState.state.PLAY;
      break;
    case MatchState.state.PLAY:
      if (maxScore(match) === SETTINGS.SCORE_TO_WIN) {
        setWinner(match, winner(match).id, event.tick);
        return;
      }
      match.state = MatchState.state.SCORE;
      break;
    case MatchState.state.SCORE:
      World.resetLevel(match.world, level.generate(level.choose()));
      World.resetTanks(match.world, match);
      updates.push(ResetLevel.create(match.world.blocks));
      updates.push(ResetTanks.create(match.world.tanks));

      match.state = MatchState.state.READY;
      break;
    case MatchState.state.FINISHED:
      return;
  }

  match.stateSpotlight = null;
  match.stateSinceTick = event.tick;
  match.nextStateOnTick = MatchState.nextStateOnTick(match.state, event.tick);
}

export function addUser(match, user, tick, updates) {
  match.users.push(user);
  match.score[user.id] = 0;

  const tankUpdate = World.newTank(match.world, tick, user);
  updates.push(tankUpdate);
}

function maxScore(match) {
  return winner(match).score;
}

export function winner(match) {
  return Object.entries(match.score)
    .map(entry => ({id: entry[0], score: entry[1]}))
    .sort((a, b) => b.score - a.score)
    [0];
}

export function finished(match) {
  return match.state === MatchState.state.FINISHED
    && match.nextStateOnTick <= match.tick;
}

export function setWinner(match, winner, tick) {
  match.state = MatchState.state.FINISHED;
  match.stateSpotlight = winner;
  match.stateSinceTick = tick;
  match.nextStateOnTick = MatchState.nextStateOnTick(match.state, tick);
}

export function setState(match, state, tick) {
  match.state = state;
  match.stateSpotlight = null;
  match.stateSinceTick = tick;
  match.nextStateOnTick = MatchState.nextStateOnTick(state, tick);
}

export function resetScore(match) {
  for (let id of Object.keys(match.score)) {
    match.score[id] = 0;
  }
}

export function resetLevel(match, blocks) {
  World.resetLevel(match.world, blocks);
}
