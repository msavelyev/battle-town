import * as immutable from '@Lib/tanks/lib/util/immutable.js';

export default function(type) {
  return immutable.freeze({
    type,
  });
}
