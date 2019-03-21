const path = require('upath')
const { fs } = require('saber-utils')
const JoyCon = require('joycon').default

const joycon = new JoyCon({
  stopDir: path.dirname(process.cwd())
})

joycon.addLoader({
  test: /\.ya?ml$/,
  loadSync: filepath =>
    require('./yaml.min').safeLoad(fs.readFileSync(filepath, 'utf8'))
})

joycon.addLoader({
  test: /\.toml$/,
  loadSync: filepath =>
    require('./toml.min').parse(fs.readFileSync(filepath, 'utf8'))
})

module.exports = {
  load(opts) {
    joycon.clearCache()
    return joycon.loadSync(opts)
  },
  resolve(opts) {
    joycon.clearCache()
    return joycon.resolveSync(opts)
  },
  CONFIG_FILES: [
    'saber-config.json',
    'saber-config.js',
    'saber-config.yml',
    'saber-config.toml'
  ]
}
