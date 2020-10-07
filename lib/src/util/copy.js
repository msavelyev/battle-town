
export default function copy(object, params) {
  const copy = Object.assign({}, object);
  const result = Object.assign(copy, params);
  return Object.freeze(result);
}
