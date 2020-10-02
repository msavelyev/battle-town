import {renderText} from './text.js';
import * as Ticker from '../../../../lib/src/Ticker.js';
import * as MatchState from '../../../../lib/src/data/MatchState.js';
import * as Match from '../../../../lib/src/data/Match.js';

export default class MatchStateRenderer {

  constructor(ctx, match, position, size) {
    this.ctx = ctx;
    this.match = match;
    this.position = position;
    this.size = size;
  }

  update() {
    const text = this.createText();

    if (!text) {
      return;
    }

    const pos = this.position(this.size);
    renderText(this.ctx, text, pos.x, pos.y, this.size.unit * 4, {
      center: true,
      stroke: true,
      bg: 'rgba(0, 0, 0, 0.8)'
    });
  }

  createText() {
    const match = this.match;
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

}
