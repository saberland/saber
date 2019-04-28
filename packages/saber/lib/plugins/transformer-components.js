exports.name = 'builtin:transformer-components'

const getPageComponent = page => {
  return page.content || ''
}

exports.apply = api => {
  api.transformers.add('vue', {
    extensions: ['vue'],
    parse(page) {
      const sfc = require('vue-template-compiler').parseComponent(page.content)
      if (sfc.script) {
        const { attributes } = require('../utils/parseAttributes')(
          sfc.script.content,
          page.internal.absolute
        )
        Object.assign(page.attributes, attributes)
      }
    },
    getPageComponent
  })

  api.transformers.add('js', {
    extensions: ['js'],
    transform(page) {
      const { attributes } = require('../utils/parseAttributes')(
        page.content,
        page.internal.absolute
      )
      Object.assign(page.attributes, attributes)
    },
    getPageComponent
  })
}
