import Direction from '../../../lib/src/data/Direction.js';
import Match from '../../../lib/src/data/Match.js';
import Point from '../../../lib/src/data/Point.js';
import World from '../../../lib/src/data/World.js';
import TankMove from '../../../lib/src/event/TankMove.js';
import MessageType from '../../../lib/src/proto/MessageType.js';
import NetMessage from '../../../lib/src/proto/NetMessage.js';
import increaseTick from '../../../lib/src/util/increaseTick.js';
import BrickRenderer from './renderer/blocks/BrickRenderer.js';
import JungleRenderer from './renderer/blocks/JungleRenderer.js';
import StoneRenderer from './renderer/blocks/StoneRenderer.js';
import WaterRenderer from './renderer/blocks/WaterRenderer.js';
import BulletRenderer from './renderer/BulletRenderer.js';
import ExplosionsRenderer from './renderer/ExplosionsRenderer.js';
import MatchStateRenderer from './renderer/MatchStateRenderer.js';
import SpawnInRenderer from './renderer/SpawnInRenderer.js';
import EmptyTextProvider from './renderer/text/EmptyTextProvider.js';
import MatchTimeTextProvider from './renderer/text/MatchTimeTextProvider.js';
import NetUsageRenderer from './renderer/text/NetUsageTextProvider.js';
import ScoreTextProvider from './renderer/text/ScoreTextProvider.js';
import TankRenderer from './renderer/TankRenderer.js';
import FpsTextProvider from './renderer/text/FpsTextProvider.js';
import PingTextProvider from './renderer/text/PingTextProvider.js';
import TextRenderer from './renderer/text/TextRenderer.js';
import TickTextProvider from './renderer/text/TickTextProvider.js';
import UnackedInputTextProvider from './renderer/text/UnackedInputTextProvider.js';
import ThisIsYouRenderer from './renderer/ThisIsYouRenderer.js';

export default class Game {

  constructor(ctx, client, sprites, conf, size) {
    this.ctx = ctx;
    this.match = conf.match;
    this.size = size;

    const world = this.match.world;
    world.authoritative = false;

    this.client = client;

    this.id = conf.id;

    this.ticks = [
      new StoneRenderer(ctx, world, sprites, this.size),
      new BrickRenderer(ctx, world, sprites, this.size),
      new WaterRenderer(ctx, world, sprites, this.size),
      new BulletRenderer(ctx, world, sprites, this.size),
      new TankRenderer(ctx, this.id, world, sprites, this.size),
      new JungleRenderer(ctx, world, sprites, this.size),

      new TextRenderer(
        ctx,
        s => new Point(s.uiX + s.unit / 4, s.unit / 4),
        this.size,
        Direction.DOWN,
        [
          new MatchTimeTextProvider(this.match),
          new EmptyTextProvider(),
          new ScoreTextProvider(this.match)
        ]
      ),

      new ExplosionsRenderer(ctx, world, sprites, this.size),
      new SpawnInRenderer(
        ctx,
        this.match,
        this.id,
        s => new Point(s.pixelWidth / 2, s.pixelHeight / 2),
        this.size
      ),
      new MatchStateRenderer(
        ctx,
        this.match,
        s => new Point(s.pixelWidth / 2, s.pixelHeight / 2),
        this.size
      ),
      new TextRenderer(
        ctx,
        s => new Point(s.uiX + s.unit / 4, s.pixelHeight),
        this.size,
        Direction.UP,
        [
          new PingTextProvider(client),
          new FpsTextProvider(),
          new TickTextProvider(this.match),
          new UnackedInputTextProvider(this.match),
          new NetUsageRenderer(this.client)
        ]
      ),

      new ThisIsYouRenderer(ctx, world, this.id, this.size)
    ];

    this.moving = false;
    this.direction = null;
    this.moveId = 0;
  }

  update(event) {
    event.tick = this.match.tick;

    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    this.ctx.strokeStyle = 'black';
    this.ctx.strokeRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    if (this.moving) {
      const move = new TankMove(increaseTick(this.moveId, val => this.moveId = val), this.direction);
      this.handleEvent(new NetMessage(
        this.id,
        MessageType.MOVE,
        move
      ));
    }

    for (let tick of this.ticks) {
      tick.update(event);
    }
  }

  startMoving(direction) {
    if (this.moving && this.direction === direction) {
      return;
    }

    this.moving = true;
    this.direction = direction;
  }

  stopMoving() {
    this.moving = false;
    this.direction = null;
  }

  shoot() {
    const tank = World.findTank(this.match.world, this.id);
    if (!tank) {
      return;
    }
    this.handleEvent(new NetMessage(
      this.id,
      MessageType.SHOOT,
      new TankMove(increaseTick(this.moveId, val => this.moveId = val), tank.direction)
    ));
  }

  handleEvent(netMessage) {
    if (Match.handleEvent(this.match, netMessage)) {
      this.client.sendNetMessage(netMessage);
      Match.addUnackedMessage(this.match, netMessage);
      return true;
    }
    return false;
  }

  onSync(tickData) {
    Match.sync(this.match, this.id, tickData);
  }

  stop() {
  }

  resize(size) {
    for (let key of Object.keys(size)) {
      this.size[key] = size[key];
    }
  }

}
