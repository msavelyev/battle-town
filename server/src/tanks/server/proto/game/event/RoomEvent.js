import {freeze} from '../../../../../../../lib/src/tanks/lib/util/immutable.js';

export default function(type) {
  return freeze({
    type,
  });
}
