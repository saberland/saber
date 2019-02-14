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

        <page-data>${JSON.stringify(page)}</page-data>
      `
    }
  })
}
