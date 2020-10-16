
export function create(id, match) {
  return {
    id: id,
    match: JSON.parse(JSON.stringify(match)),
  };
}
