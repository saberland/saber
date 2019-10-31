const yaml = require('../utils/yaml.min')

module.exports = function(source) {
  return JSON.stringify(yaml.safeLoad(source))
}
