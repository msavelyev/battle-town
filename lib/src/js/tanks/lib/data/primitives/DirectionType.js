const {freeze} = require('@Lib/tanks/lib/util/immutable.js');

const DirectionType = freeze({
  HORIZONTAL: 'HORIZONTAL',
  VERTICAL: 'VERTICAL'
});
module.exports.DirectionType = DirectionType;
