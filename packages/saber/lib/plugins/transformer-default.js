exports.name = 'builtin:transformer-markdefault'

exports.apply = api => {
  api.transformers.add('default', {
    getPageComponent(page) {
      return `
        <template>
          <layout-manager :page="$page">
            ${page.content || ''}
          </layout-manager>
        </template>
      `
    }
  })
}
