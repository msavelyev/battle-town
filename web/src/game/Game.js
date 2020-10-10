import * as Direction from '../../../lib/src/data/primitives/Direction.js';
import * as Match from '../../../lib/src/data/Match.js';
import * as Point from '../../../lib/src/data/primitives/Point.js';
import * as World from '../../../lib/src/data/World.js';
import * as TankMove from '../../../lib/src/event/TankMove.js';
import MessageType from '../../../lib/src/proto/MessageType.js';
import { NetMessage } from '../../../lib/src/proto/NetMessage.js';
import {copy} from '../../../lib/src/util/immutable.js';
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
import UnitSizeTextProvider from './renderer/text/UnitSizeTextProvider.js';
import ThisIsYouRenderer from './renderer/ThisIsYouRenderer.js';

export default class Game {

  constructor(ctx, client, sprites, conf, size) {
    this.ctx = ctx;
    this.match = conf.match;
    this.size = size;

    this.match = copy(this.match, {
      world: copy(this.match.world, {
        authoritative: false
      }),
    });

    this.client = client;

    this.id = conf.id;

    this.renderers = [
      new StoneRenderer(ctx, this, sprites),
      new BrickRenderer(ctx, this, sprites),
      new WaterRenderer(ctx, this, sprites),
      new BulletRenderer(ctx, this, sprites),
      new TankRenderer(ctx, this, sprites),
      new JungleRenderer(ctx, this, sprites),

      new TextRenderer(
        ctx,
        s => Point.create(s.uiX + s.unit / 2, s.unit / 2),
        this.size,
        Direction.Direction.DOWN,
        [
          new MatchTimeTextProvider(this),
          new EmptyTextProvider(),
          new ScoreTextProvider(this)
        ]
      ),

      new ExplosionsRenderer(ctx, this, sprites),
      new SpawnInRenderer(
        ctx,
        this,
        s => Point.create(s.pixelWidth / 2, s.pixelHeight / 2)
      ),
      new MatchStateRenderer(
        ctx,
        this,
        s => Point.create(s.pixelWidth / 2, s.pixelHeight / 2)
      ),
      new TextRenderer(
        ctx,
        s => Point.create(s.uiX + s.unit / 2, s.pixelHeight),
        this.size,
        Direction.Direction.UP,
        [
          new PingTextProvider(client),
          new FpsTextProvider(),
          new TickTextProvider(this),
          new UnackedInputTextProvider(this),
          new NetUsageRenderer(this.client),
          new UnitSizeTextProvider(this)
        ]
      ),

      new ThisIsYouRenderer(ctx, this)
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
      const move = TankMove.create(increaseTick(this.moveId, val => this.moveId = val), this.direction);
      this.handleEvent(NetMessage(
        this.id,
        MessageType.MOVE,
        move
      ));
    }

    for (let tick of this.renderers) {
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
    this.handleEvent(NetMessage(
      this.id,
      MessageType.SHOOT,
      TankMove.create(increaseTick(this.moveId, val => this.moveId = val), tank.direction)
    ));
  }

  handleEvent(netMessage) {
    const updates = [];
    this.match = Match.handleEvent(this.match, netMessage, updates);
    if (updates.length > 0) {
      this.client.sendNetMessage(netMessage);
      this.match = Match.addUnackedMessage(this.match, netMessage);
      return true;
    }
    return false;
  }

  onSync(tickData) {
    this.match = Match.sync(this.match, this.id, tickData);
  }

  stop() {
  }

  resize(size) {
    for (let key of Object.keys(size)) {
      this.size[key] = size[key];
    }
  }

}
