
export function createModifyResult(result, success) {
  return {success, result};
}

export function modifiedSuccessfully(result) {
  return createModifyResult(result, true);
}

export function modifiedUnsuccessfully(result) {
  return createModifyResult(result, false);
}

export function getResult(result) {
  return result.result;
}

export function isSuccessful(result) {
  return result.success;
}
