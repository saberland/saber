const { spawn } = require('child_process')

module.exports = {
  setNodeEnv(env) {
    if (!process.env.NODE_ENV) {
      process.env.NODE_ENV = env
    }
  },
  handleError(err) {
    if (typeof err === 'string') err = new Error(err)
    require('saber-log').log.error(err.stack)
    process.exit(1) // eslint-disable-line
  },
  spawn(...args) {
    return new Promise((resolve, reject) => {
      const childProcess = spawn(...args)
      childProcess.on('close', resolve)
      childProcess.on('error', reject)
    })
  }
}
