const _ = require('lodash');

module.exports = function concat(...what) {
  return _.join(what, '');
}
