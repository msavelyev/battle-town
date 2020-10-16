import * as rand from '../../lib/src/tanks/lib/util/rand.js';

export default Object.freeze({
  generate: function() {
    const num = rand.randomInt(60000, 200000);
    return `user#${num}`
  },

  validate: function(username) {
    return username.length > 2 && username.length <= 32;
  },
});
