/**
 *
 * @return {Array}
 */
function array() {
  return freeze([]);
}
module.exports.array = array;

/**
 *
 * @param {Array} arr
 * @param item
 * @return {Array}
 */
function push(arr, item) {
  return freeze(arr.concat(item));
}
module.exports.push = push;

/**
 *
 * @param {Array} arr
 * @param pred
 * @return {Array}
 */
function filter(arr, pred) {
  return freeze(arr.filter(pred));
}
module.exports.filter = filter;

/**
 * @param {Array} arr
 * @param {Function} func
 */
function map(arr, func) {
  return freeze(arr.map(func));
}
module.exports.map = map;

/**
 *
 * @param {Array} arr
 * @param {Array} other
 * @returns {Array}
 */
function concat(arr, other) {
  return freeze(arr.concat(other));
}
module.exports.concat = concat;

/**
 *
 * @returns {object}
 */
function obj() {
  return freeze({});
}
module.exports.obj = obj;

/**
 *
 * @template T
 * @param {T} object
 * @return {T}
 */
function freeze(object) {
  return Object.freeze(object);
}
module.exports.freeze = freeze;

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
module.exports.assign = assign;

/**
 *
 * @template OBJ, PARAMS
 * @param {OBJ} object
 * @param {PARAMS} params
 * @return {OBJ & PARAMS}
 */
function copy(object, params) {
  const copy = assign({}, object);
  const result = assign(copy, params);
  return freeze(result);
}
module.exports.copy = copy;

/**
 *
 * @template OBJ
 * @param {OBJ} object
 * @param key
 * @returns {OBJ}
 */
function withoutKey(object, key) {
  const copy = assign({}, object);
  delete copy[key];
  return freeze(copy);
}
module.exports.withoutKey = withoutKey;
