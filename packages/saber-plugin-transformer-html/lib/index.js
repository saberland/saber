exports.name = 'transformer-html'

exports.apply = api => {
  api.transformers.add('html', {
    extensions: ['html'],
    parse(page) {
      const { body, frontmatter } = api.transformers.parseFrontmatter(
        page.content
      )
      page.content = body
      Object.assign(page.attributes, frontmatter)
    },
    getPageComponent(page) {
      return `<template>
        <layout-manager :page="$page" :layout="$options.layout">
          ${page.content || ''}
        </layout-manager>
      </template>
      `
    }
  })
}
