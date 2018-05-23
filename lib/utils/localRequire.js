const path = require('path')
const resolveFrom = require('resolve-from')

class LocalRequire {
  constructor() {
    this.options = {}
  }

  setOptions(options = {}) {
    Object.keys(options).forEach(key => {
      if (options[key] !== undefined) {
        this.options[key] = options[key]
      }
    })
  }

  require(name, baseDir) {
    return require(this.resolve(name, baseDir))
  }

  resolve(name, baseDir) {
    baseDir = baseDir || this.options.baseDir

    if (path.isAbsolute(name)) {
      return name
    }

    return resolveFrom(baseDir, name)
  }
}

module.exports = new LocalRequire()
