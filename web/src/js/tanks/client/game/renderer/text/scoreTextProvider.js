import * as Match from 'Lib/tanks/lib/data/Match.js';

function trimName(name) {
  if (name.length <= 13) {
    return name;
  } else {
    return name.substr(0, 12) + '…';
  }
}


export default function(game) {
  return () => {
    const scores = [];

    const entries = Object.entries(game.match.score);
    entries.sort((a, b) => b[1] - a[1]);
    for (let [id, score] of entries) {
      const user = Match.findUser(game.match, id);
      const text = `${trimName(user.name)}: ${score}`;

      scores.push(text);
    }

    scores.push('');

    return scores;
  };
}

