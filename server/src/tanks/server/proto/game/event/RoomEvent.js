import {freeze} from '@Lib/tanks/lib/util/immutable.js';

export default function(type) {
  return freeze({
    type,
  });
}
