exports.name = 'builtin:transformer-markdefault'

exports.apply = api => {
  api.transformers.add('default', {
    getPageComponent(page) {
      return `
        <template>
          <saber-layout>
            ${page.content || ''}
          </saber-layout>
        </template>
      `
    }
  })
}
