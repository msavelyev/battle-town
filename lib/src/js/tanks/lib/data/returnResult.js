
function createModifyResult(result, success) {
  return {success, result};
}
module.exports.createModifyResult = createModifyResult;

function modifiedSuccessfully(result) {
  return createModifyResult(result, true);
}
module.exports.modifiedSuccessfully = modifiedSuccessfully;

function modifiedUnsuccessfully(result) {
  return createModifyResult(result, false);
}
module.exports.modifiedUnsuccessfully = modifiedUnsuccessfully;

function getResult(result) {
  return result.result;
}
module.exports.getResult = getResult;

function isSuccessful(result) {
  return result.success;
}
module.exports.isSuccessful = isSuccessful;
