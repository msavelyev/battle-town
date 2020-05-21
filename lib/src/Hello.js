const concat = require('./concat');

class Hello {
  constructor(what) {
    this.what = what;
  }

  hello() {
    return concat('Hello, ', this.what);
  }
}

module.exports = Hello
