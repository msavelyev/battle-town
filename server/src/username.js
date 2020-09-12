import randomInt from '../../lib/src/util/randomInt.js';

export default Object.freeze({
  generate: function() {
    const num = randomInt(60000, 200000);
    return `user#${num}`
  },

  validate: function(username) {
    return username.length > 2 && username.length <= 32;
  },
});
