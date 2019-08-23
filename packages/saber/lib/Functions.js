module.exports = class Functions extends Map {
  constructor(api) {
    super()
    this.api = api
  }

  run(name, query) {
    const fn = this.get(name)
    return fn.handler({ api: this.api, query })
  }
}
