module.exports = function isBrowser() {
  const isBrowser = new Function("try {return this===window;}catch(e){ return false;}");
  return isBrowser();
};
