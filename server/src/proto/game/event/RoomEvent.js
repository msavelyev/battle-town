import {freeze} from '../../../../../lib/src/util/immutable.js';

export default function(type) {
  return freeze({
    type,
  });
}
