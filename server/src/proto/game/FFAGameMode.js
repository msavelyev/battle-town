import Configuration from '../../../../lib/src/data/Configuration.js';
import Match from '../../../../lib/src/data/Match.js';
import MatchState from '../../../../lib/src/data/MatchState.js';
import World from '../../../../lib/src/data/World.js';
import Score from '../../../../lib/src/data/worldevent/Score.js';
import State from '../../../../lib/src/data/worldevent/State.js';
import TankUpdate from '../../../../lib/src/data/worldevent/TankUpdate.js';
import EventType from '../../../../lib/src/proto/EventType.js';
import MessageType from '../../../../lib/src/proto/MessageType.js';
import NetMessage from '../../../../lib/src/proto/NetMessage.js';
import log from '../../../../lib/src/util/log.js';
import level from '../../level.js';
import Room from './Room.js';

export default class FFAGameMode {

  constructor(ticker) {
    this.ticker = ticker;
    this.room = null;
  }

  init() {
    this.room = new Room('FFA', this.ticker.tick);
    const match = this.room.match;
    const world = match.world;
    World.resetLevel(world, level.ffa());
    Match.setState(match, MatchState.WAITING_FOR_PLAYERS, this.ticker.tick);
  }

  authorizePlayer(player) {
    if (Room.hasPlayer(this.room, player)) {
      throw new Error('Already connected');
    }

    const client = player.client;
    const user = player.user;
    client.send(EventType.MATCH_FOUND);

    this.room.add(player);
    player.onDisconnect(this.onDisconnect(player));
    client.on(EventType.MESSAGE, netMessage => {
      this.room.handleEvent(client, netMessage, user.id);
    });

    const match = this.room.match;

    log.info('authorized with tanks', match.world.tanks);

    client.sendMessage(
      new NetMessage(user.id, MessageType.INIT, new Configuration(user.id, match))
    );
  }

  onDisconnect(player) {
    return () => {
      this.room.remove(player);
    };
  }

  update(event) {
    this.room.update(
      event,
      this.onBeforeWorldUpdate.bind(this),
      this.onKill.bind(this)
    );
  }

  onBeforeWorldUpdate(match, event, updates) {
    if (this.room.size() >= 2 && match.state !== MatchState.PLAY) {
      Match.setState(match, MatchState.PLAY, this.ticker.tick);
      updates.push(State.fromMatch(match));
    } else if (this.room.size() === 1 && match.state === MatchState.PLAY) {
      Match.setState(match, MatchState.WAITING_FOR_PLAYERS, this.ticker.tick);
      updates.push(State.fromMatch(match));
    }
  }

  onKill(match, event, killer, victimId, updates) {
    match.score[killer] += 1;
    updates.push(new Score(match.score));

    const world = match.world;
    World.removeTank(world, victimId);

    const user = Match.findUser(match, victimId);
    World.createTank(world, user);

    const victimTank = World.findTank(world, victimId);
    updates.push(TankUpdate.fromTank(victimTank));
  }

  stop() {
  }

}
