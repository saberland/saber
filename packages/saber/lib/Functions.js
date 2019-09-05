module.exports = class Functions extends Map {
  constructor(api) {
    super()
    this.api = api
  }

  run(name, args) {
    const fn = this.get(name)
    return fn.handler.call(this, args)
  }
}
