const { spawn } = require('child_process')

module.exports = {
  setNodeEnv(env) {
    if (!process.env.NODE_ENV) {
      process.env.NODE_ENV = env
    }
  },
  handleError(fn) {
    return async (...args) => {
      try {
        await fn(...args)
      } catch (error) {
        const message = typeof error === 'string' ? error : error.stack
        require('saber-log').log.error(message)
        process.exit(1) // eslint-disable-line
      }
    }
  },
  spawn(...args) {
    return new Promise((resolve, reject) => {
      const childProcess = spawn(...args)
      childProcess.on('close', resolve)
      childProcess.on('error', reject)
    })
  }
}
