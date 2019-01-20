const resolveFrom = require('resolve-from')

exports.name = 'builtin:transformer-js'

exports.apply = api => {
  api.registerTransformer('js', (page, file) => {
    const { attributes } = require('../utils/parseAttributes')(
      file.content,
      file.absolute
    )
    Object.assign(page.attributes, attributes)
  })
}
