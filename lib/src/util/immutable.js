/**
 *
 * @return {Array}
 */
export function array() {
  return freeze([]);
}

/**
 *
 * @param {Array} arr
 * @param item
 * @return {Array}
 */
export function push(arr, item) {
  return freeze(arr.concat(item));
}

/**
 *
 * @param {Array} arr
 * @param pred
 * @return {Array}
 */
export function filter(arr, pred) {
  return freeze(arr.filter(pred));
}

/**
 * @param {Array} arr
 * @param {Function} func
 */
export function map(arr, func) {
  return freeze(arr.map(func));
}

/**
 *
 * @param {Array} arr
 * @param {Array} other
 * @returns {Array}
 */
export function concat(arr, other) {
  return freeze(arr.concat(other));
}

/**
 *
 * @template T
 * @param {T} object
 * @return {T}
 */
export function freeze(object) {
  return Object.freeze(object);
}

/**
 *
 * @template OBJ, PARAMS
 * @param {OBJ} obj
 * @param {PARAMS} params
 * @return {OBJ & PARAMS}
 */
function assign(obj, params) {
  return Object.assign(obj, params);
}

/**
 *
 * @template OBJ, PARAMS
 * @param {OBJ} object
 * @param {PARAMS} params
 * @return {OBJ & PARAMS}
 */
export function copy(object, params) {
  const copy = assign({}, object);
  const result = assign(copy, params);
  return freeze(result);
}
