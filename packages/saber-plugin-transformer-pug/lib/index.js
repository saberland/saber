const path = require('path')
const pug = require('pug')
const extractSFCBlocks = require('extract-sfc-blocks')

const ID = 'transformer-pug'

exports.name = ID

exports.apply = api => {
  api.transformers.add('pug', {
    extensions: ['pug'],
    parse(page) {
      const { body, frontmatter } = api.transformers.parseFrontmatter(
        page.content
      )
      const { base: basename, dir: dirname } = path.parse(
        page.internal.absolute || ''
      )
      const html = pug.render(body, {
        filename: basename,
        basedir: dirname
      })
      const { html: pageContent, blocks } = extractSFCBlocks(html)
      page.content = pageContent
      page.internal.hoistedTags = blocks
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

  api.hooks.chainWebpack.tap(ID, config => {
    config.resolveLoader.alias.set(
      'saber-pug-frontmatter-loader',
      require.resolve('./saber-pug-frontmatter-loader')
    )

    config.module
      .rule('pug')
      .test(/\.pug$/)
      .oneOf('vue')
      .resourceQuery(/\?vue/)
      .use('pug-loader')
      .loader(require.resolve('pug-plain-loader'))
      .end()
      .oneOf('normal')
      .use('pug-loader')
      .loader('saber-pug-frontmatter-loader')
      .before('pug-plain-loader')
      .end()
  })
}
