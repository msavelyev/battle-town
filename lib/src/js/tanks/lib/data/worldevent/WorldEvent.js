
export function WorldEvent(type, params) {
  return Object.assign({
    type,
    target: null
  }, params);
}
