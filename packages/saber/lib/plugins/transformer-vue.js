const { parseComponent } = require('vue-template-compiler')

exports.name = 'builtin:transformer-js'

exports.apply = api => {
  api.registerTransformer('vue', (page, file) => {
    const sfc = parseComponent(file.content)
    if (sfc.script) {
      const { attributes } = require('../utils/parseAttributes')(
        sfc.script.content,
        file.absolute
      )
      Object.assign(page.attributes, attributes)
    }
  })
}
