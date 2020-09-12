import MatchState from './MatchState.js';
import MessageType from '../proto/MessageType.js';
import compareTick from '../util/compareTick.js';
import World from './World.js';
import level from '../../../server/src/level.js';

import {SETTINGS} from '../util/dotenv.js';
import analytics from '../util/analytics.js';

import { Match } from '../protobuf/Data.js';

Match.n = function(id, world, tick, levelId) {
  const state = MatchState.PREPARE;
  const users = [];
  const score = {};
  const ack = {};
  const stateSinceTick = tick;
  const nextStateOnTick = MatchState.nextStateOnTick(state, tick);
  const stateSpotlight = null;
  
  World.resetLevel(world, level.generate(levelId));

  const match = Match.create({
    state,
    users,
    world,
    score,
    tick,
    ack,
    levelId,
    stateSinceTick,
    nextStateOnTick,
    stateSpotlight
  });
  match.unackedMessages = [];
  return match
};

Match.removeTank = function(match, id, cleanScore) {
  World.removeTank(match.world, id);

  if (cleanScore) {
    delete match.score[id];
  }
};

Match.update = function(match, event) {
  if (match.world.authoritative) {
    match.tick = event.tick;
    match.event = event;

    if (match.nextStateOnTick === event.tick) {
      Match.transitionState(match, event);
    }
  }

  World.update(match.world, event, id => {
    if (match.state === MatchState.PLAY) {
      match.score[id] += 1;

      if (match.world.authoritative) {
        Match.transitionState(match, event);
        match.stateSpotlight = id;
      }
    }
  });
};

Match.findUser = function(match, id) {
  return match.users.find(user => user.id === id);
};

Match.handleEvent = function(match, netMessage) {
  switch (netMessage.type) {
    case MessageType.MOVE:
      return Match.handleMove(match, netMessage, World.move);
    case MessageType.SHOOT:
      return Match.handleMove(match, netMessage, World.shoot);
    default:
      console.error('Unknown message', netMessage);
      return false;
  }
};

Match.handleMove = function(match, netMessage, method) {
  const tankMove = netMessage.data;
  const id = netMessage.id;

  Match.addAck(match, id, tankMove.moveId);

  if (netMessage.type === MessageType.MOVE && !MatchState.movable(match.state)) {
    return false;
  }

  if (netMessage.type === MessageType.SHOOT && !MatchState.shootable(match.state)) {
    return false;
  }

  return method(match.world, id, tankMove.direction);
};

Match.addAck = function(match, id, moveId) {
  match.ack[id] = Math.max(moveId, match.ack[id]);
};

Match.addUnackedMessage = function(match, netMessage) {
  match.unackedMessages.push(netMessage);
};

Match.sync = function(match, id, data) {
  if (match.state !== data.state) {
    Match.trackMatchTransition(data, id);
  }
  match.state = data.state;
  match.score = data.score;
  match.users = data.users;
  match.ack = data.ack;
  match.tick = data.tick;
  match.stateSinceTick = data.stateSinceTick;
  match.nextStateOnTick = data.nextStateOnTick;
  match.stateSpotlight = data.stateSpotlight;

  World.sync(match.world, World.create(data.world));

  match.unackedMessages = match.unackedMessages.filter(move => {
    if (match.ack[id] === undefined) {
      return true;
    }

    return compareTick(move.data.moveId, match.ack[id]) > 0;
  });

  for (let netMessage of match.unackedMessages) {
    switch (netMessage.type) {
      case MessageType.MOVE:
        const move = netMessage.data;
        World.move(match.world, id, move.direction);
        break;
      case MessageType.SHOOT:
        // newBullets = this.replaceEntity(newBullets, this.findBullet(id));
        break;
    }
  }
};

Match.trackMatchTransition = function(match, id) {
  if (match.state === MatchState.SCORE && match.stateSpotlight === id) {
    analytics.log('MATCH_SCORE');
  } else if (match.state === MatchState.FINISHED && match.stateSpotlight === id) {
    analytics.log('MATCH_WIN');
  } else if (match.state === MatchState.FINISHED && match.stateSpotlight !== id) {
    analytics.log('MATCH_LOSS');
  }
};

Match.copy = function(match) {
  const copy = Match.create(Match.fromObject(Match.toObject(match)));
  copy.world.authoritative = true;
  return copy;
};

Match.transitionState = function(match, event) {
  switch (match.state) {
    case MatchState.PREPARE:
      match.state = MatchState.READY;
      break;
    case MatchState.READY:
      match.state = MatchState.PLAY;
      break;
    case MatchState.PLAY:
      if (Match.maxScore(match) === SETTINGS.SCORE_TO_WIN) {
        Match.setWinner(match, Match.winner(match).id, event.tick);
        return;
      }
      match.state = MatchState.SCORE;
      break;
    case MatchState.SCORE:
      match.state = MatchState.READY;
      break;
    case MatchState.FINISHED:
      return;
  }

  if (match.state === MatchState.READY) {
    World.resetLevel(match.world, level.generate(match.levelId));
    World.resetTanks(match.world, match);
  }

  match.stateSpotlight = null;
  match.stateSinceTick = event.tick;
  match.nextStateOnTick = MatchState.nextStateOnTick(match.state, event.tick);
};

Match.addUser = function(match, user) {
  match.users.push(user);
  match.score[user.id] = 0;
};

Match.maxScore = function(match) {
  return Match.winner(match).score;
};

Match.winner = function(match) {
  return Object.entries(match.score)
    .map(entry => ({id: entry[0], score: entry[1]}))
    .sort((a, b) => b.score - a.score)
    [0];
};

Match.finished = function(match) {
  return match.state === MatchState.FINISHED
    && match.nextStateOnTick <= match.tick;
};

Match.setWinner = function(match, winner, tick) {
  match.state = MatchState.FINISHED;
  match.stateSpotlight = winner;
  match.stateSinceTick = tick;
  match.nextStateOnTick = MatchState.nextStateOnTick(match.state, tick);
};

export default Match;
