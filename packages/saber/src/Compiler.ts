import { EventEmitter } from 'events'
import WebpackChain from 'webpack-chain'
import { Compiler as WebpackCompiler } from 'webpack'
import { Saber } from './'

export class Compiler extends EventEmitter {
  type: string
  api: Saber
  status: 'waiting' | 'success' | 'building' | 'error'

  constructor(type: string, api: Saber) {
    super()
    this.type = type
    this.api = api
    this.status = 'waiting'
  }

  injectToWebpack(config: WebpackChain) {
    const ID = `compiler-${this.type}`
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const context = this
    config.plugin(ID).use(
      class {
        apply(compiler: WebpackCompiler) {
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
