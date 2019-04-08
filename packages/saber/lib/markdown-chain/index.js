/**
 * Modified: https://github.com/ulivz/markdown-it-chain/blob/master/src/index.js
 */

const ChainedMap = require('webpack-chain/src/ChainedMap')
const Plugin = require('./Plugin')
const Options = require('./Options')

module.exports = class MarkdownItChain extends ChainedMap {
  constructor() {
    super()
    this.options = new Options(this)
    this.plugins = new ChainedMap(this)
  }

  toConfig() {
    return this.clean(
      Object.assign(this.entries() || {}, {
        options: this.options.entries(),
        plugins: this.plugins.values().map(plugin => plugin.toConfig())
      })
    )
  }

  plugin(name) {
    if (!this.plugins.has(name)) {
      this.plugins.set(name, new Plugin(this))
    }

    return this.plugins.get(name)
  }
}
