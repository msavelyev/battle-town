import * as Match from 'Lib/tanks/lib/data/Match.js';
import * as MatchState from 'Lib/tanks/lib/data/MatchState.js';
import * as Ticker from 'Lib/tanks/lib/Ticker.js';
import {renderText} from 'Client/tanks/client/game/renderer/text.js';

function createText(game) {
  const match = game.match;
  const state = match.state;
  const tick = match.tick;
  const stateSinceTick = match.stateSinceTick;
  const stateTicks = tick - stateSinceTick;
  const nextStateOnTick = match.nextStateOnTick;
  const spotlight = Match.findUser(match, match.stateSpotlight);

  const countdown = Ticker.countdown(tick, nextStateOnTick);

  switch (state) {
    case MatchState.state.PREPARE:
      return `Prepare to fight`;
    case MatchState.state.READY:
      return `${countdown}`;
    case MatchState.state.PLAY:
      if (stateTicks > Ticker.FPS) {
        return null;
      } else {
        return 'GO';
      }
    case MatchState.state.SCORE:
      return `${spotlight.name} scored`;
    case MatchState.state.FINISHED:
      return `${spotlight.name} won`;
    case MatchState.state.WAITING_FOR_PLAYERS:
      if (Math.floor((stateTicks / 60)) % 10 === 0) {
        return 'Waiting for other players';
      } else {
        return null;
      }
    default:
      return `${state}: ${countdown}`;
  }
}

export default function(ctx, game, position) {
  return () => {
    const size = game.size;
    const text = createText(game);

    if (!text) {
      return;
    }

    const pos = position(size);
    renderText(ctx, text, pos.x, pos.y, size.unit * 8, {
      center: true,
      stroke: true,
      bg: 'rgba(0, 0, 0, 0.8)'
    });
  };
}
