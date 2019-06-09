const vm = require('vm')
const devalue = require('devalue')
const loaderUtils = require('loader-utils')

module.exports = async function(source) {
  const callback = this.async()
  const params = loaderUtils.parseQuery(this.resourceQuery)
  const sandbox = {
    require,
    module: {}
  }
  vm.createContext(sandbox)
  const mod = vm.runInContext(source, sandbox)
  const result = await mod(params.name)
  return callback(null, `export default ${devalue(result)}`)
}
