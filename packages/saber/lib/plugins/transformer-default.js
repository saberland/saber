exports.name = 'builtin:transformer-markdefault'

exports.apply = api => {
  api.transformers.add('default', {
    transform() {},
    getPageComponent(page, content) {
      return `
        <template>
          <layout-manager :page="$page">
            ${content || ''}
          </layout-manager>
        </template>

        <extend-component>
        export default {
          pageData: ${JSON.stringify(page)}
        }
        </extend-component>
      `
    }
  })
}
