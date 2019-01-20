const qs = require('querystring')

module.exports = function (source) {
  const { saberPage } = this.resourceQuery && qs.parse(this.resourceQuery.slice(1))
  const { api } = this.query

  if (!saberPage) return source
  // We don't need internal here
  const page = Object.assign({}, api.source.pages.get(saberPage))
  const { type, id } = page.internal
  delete page.internal

  this.addDependency(api.resolveCache(`pages/${id}.pson`))

  let result

  if (!type || type === 'md') {
    const { content, hoistedTags = [] } = page
    delete page.hoistedTags
    delete page.content

    result = `<template>
      <layout-manager :page="$page">
        ${content || ''}
      </layout-manager>
    </template>

    ${hoistedTags.join('\n')}


    <page-data>${JSON.stringify(page)}</page-data>
    `
  } else if (type === 'js' || type === 'vue') {
    result = `<template>
      <layout-manager :page="$page">
        <page-component />
      </layout-manager>
    </template>

    <page-component>import PageComponent from ${JSON.stringify(this.resourcePath)}</page-component>

    <page-data>${JSON.stringify(page)}</page-data>
    `
  }

  return result
}
