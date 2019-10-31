exports.name = 'builtin:transformer-markdefault'

exports.apply = api => {
  api.transformers.add('default', {
    getPageComponent(page) {
      return `
        <template>
          <layout-manager>
            ${page.content || ''}
          </layout-manager>
        </template>
      `
    }
  })
}
