export default class Configuration {

  constructor(id, match) {
    this.id = id;
    this.match = JSON.parse(JSON.stringify(match));
  }

}
