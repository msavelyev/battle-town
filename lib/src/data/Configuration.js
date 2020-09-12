import { Configuration } from '../protobuf/Data.js';

Configuration.n = function(id, match) {
  return Configuration.create({ id, match });
};

export default Configuration;
