const vm = require('vm')
const devalue = require('devalue')

module.exports = async function(source) {
  const sandbox = {
    require,
    module
  }
  vm.createContext(sandbox)
  const mod = vm.runInContext(source, sandbox)
  const result = await mod(this.resourceQuery.replace('?name=', ''))
  return `export default ${devalue(result)}`
}
