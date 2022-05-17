import {freeze} from 'Lib/tanks/lib/util/immutable.js';

export function input() {
  return freeze({
    input: null,
    networkInput: null,
    networkOutput: null,
    unackedInput: null,
    match: null,
  })
}
