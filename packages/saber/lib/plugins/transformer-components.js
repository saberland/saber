const { slash } = require('saber-utils')

exports.name = 'builtin:transformer-components'

const getPageComponent = page => {
  return `<script>
  import PageComponent from "${slash(page.absolute)}"

  export default {
    render(h) {
      return h('layout-manager', {
        scopedSlots: {
          component(props) {
            return h(PageComponent, { props })
          }
        }
      })
    }
  }
  </script>
  `
}

exports.apply = api => {
  api.transformers.add('vue', {
    extensions: ['vue'],
    parse(page) {
      const sfc = require('vue-template-compiler').parseComponent(page.content)
      if (sfc.script) {
        const { fields } = require('../utils/parseFields')(
          sfc.script.content,
          page.absolute
        )
        Object.assign(page.fields, fields)
      }
    },
    getPageComponent
  })

  api.transformers.add('js', {
    extensions: ['js'],
    transform(page) {
      const { fields } = require('../utils/parseFields')(
        page.content,
        page.absolute
      )
      Object.assign(page.fields, fields)
    },
    getPageComponent
  })
}
