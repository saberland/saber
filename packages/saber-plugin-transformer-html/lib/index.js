const extractSFCBlocks = require('extract-sfc-blocks')

exports.name = 'transformer-html'

exports.apply = api => {
  api.transformers.add('html', {
    extensions: ['html'],
    parse(page) {
      const { body, frontmatter } = api.transformers.parseFrontmatter(
        page.content
      )
      const { html, blocks } = extractSFCBlocks(body)
      Object.assign(page, frontmatter)
      page.content = html
      page.internal.hoistedTags = blocks
    },
    getPageComponent(page) {
      return `<template>
        <layout-manager>
          ${page.content || ''}
        </layout-manager>
      </template>
      `
    }
  })
}
