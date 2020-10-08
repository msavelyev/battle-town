import * as Match from '../../../../../lib/src/data/Match.js';
import TextRenderProvider from './TextRenderProvider.js';

export default class ScoreTextProvider extends TextRenderProvider {

  constructor(game) {
    super();

    this.game = game;
  }

  update() {
    const scores = [];

    const entries = Object.entries(this.game.match.score);
    entries.sort((a, b) => b[1] - a[1]);
    for (let [id, score] of entries) {
      const user = Match.findUser(this.game.match, id);
      const text = `${this.trimName(user.name)}: ${score}`;

      scores.push(text);
    }

    scores.push('');

    return scores;
  }

  trimName(name) {
    if (name.length <= 13) {
      return name;
    } else {
      return name.substr(0, 12) + '…';
    }
  }

}
