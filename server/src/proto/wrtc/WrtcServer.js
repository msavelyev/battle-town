import bodyParser from 'body-parser';
import cors from 'cors';
import NetServer from '../base/NetServer.js';
import WrtcStuff from './WrtcStuff.js';

export default class WrtcServer extends NetServer {

  constructor(expressApp) {
    super();

    expressApp.use(cors());
    expressApp.use(bodyParser.json());

    this.expressApp = expressApp;
    this.wrtcStuff = new WrtcStuff();
  }

  start() {
    this.expressApp.get('/a/connection', async (req, res) => {
      const localDescription = await this.wrtcStuff.createConnection();

      res.send(localDescription);
    });

    this.expressApp.post('/a/connection/remote', async (req, res) => {
      const body = req.body;

      await this.wrtcStuff.applyAnswer(body.id, body.desc);

      res.send({ ok: 'ok' });
    });
  }

  onConnected(cb) {
    this.wrtcStuff.onConnected(cb);
  }
}
