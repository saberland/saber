const vm = require('vm')
const devalue = require('devalue')

module.exports = async function(source) {
  const callback = this.async()
  const sandbox = {
    require,
    module: {}
  }
  vm.createContext(sandbox)
  const mod = vm.runInContext(source, sandbox)
  const result = await mod(this.resourceQuery.replace('?name=', ''))
  return callback(null, `export default ${devalue(result)}`)
}
