const toml = require('../utils/toml.min')

module.exports = function(source) {
  return JSON.stringify(toml.parse(source))
}
