
module.exports = {
  implement(base, extension) {
    for (const key of Object.keys(base)) {
      if (!extension[key]) {
        throw new Error(
          'Extension ' + extension + ' doesn\'t implement method ' + key + ' of ' + base
        );
      }
    }

    return extension;
  },
};
