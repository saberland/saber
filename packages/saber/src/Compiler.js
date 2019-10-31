const { EventEmitter } = require('events')

module.exports = class Compiler extends EventEmitter {
  constructor(type, api) {
    super()
    this.type = type
    this.api = api
    this.status = 'waiting'
  }

  injectToWebpack(config) {
    const ID = `compiler-${this.type}`
    const context = this
    config.plugin(ID).use(
      class {
        apply(compiler) {
          compiler.hooks.watchRun.tap(ID, () => {
            context.status = 'building'
            context.emit('status-changed', {
              status: context.status,
              allCompilers: {
                ready: false,
                hasError: false
              }
            })
          })
          compiler.hooks.done.tap(ID, stats => {
            if (stats.hasErrors()) {
              context.status = 'error'
            } else {
              context.status = 'success'
            }

            const allCompilers = { ready: true, hasError: false }
            Object.values(context.api.compilers).forEach(({ status }) => {
              if (status !== 'success' && status !== 'error') {
                allCompilers.ready = false
              }

              if (status === 'error') {
                allCompilers.hasError = true
              }
            })

            context.emit('status-changed', {
              status: context.status,
              allCompilers
            })
          })
        }
      }
    )
  }
}
