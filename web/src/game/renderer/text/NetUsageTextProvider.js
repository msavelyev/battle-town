import {SETTINGS} from '../../../../../lib/src/util/dotenv.js';
import TextRenderProvider from './TextRenderProvider.js';

const LITERALS = [
  'b',
  'Kb',
  'Mb'
]

export default class NetUsageTextProvider extends TextRenderProvider {

  constructor(client) {
    super();

    this.client = client;
  }

  update() {
    if (!SETTINGS.DEBUG_INFO) {
      return null;
    }

    const usage = this.client.netClient.usage;
    return [
      'out: ' + this.format(usage.last.write),
      'in: ' + this.format(usage.last.read)
    ];
  }

  format(value) {
    let power = 0;
    while (value > 1024) {
      value /= 1024;
      power += 1;
    }

    return `${Math.round(value * 100) / 100} ${LITERALS[power]}/s`;
  }

}
