const path = require('path')
const JoyCon = require('joycon').default

module.exports = new JoyCon({
  files: ['saber.config.js'],
  stopDir: path.dirname(process.cwd())
})
