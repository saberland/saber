module.exports = function (source) {
  const data = JSON.parse(source)

  const { content, hoistedTags = [] } = data
  delete data.content
  delete data.hoistedTags

  const result = `
<template>
  <layout-manager :page="$page">
  ${content}
  </layout-manager>
</template>

${hoistedTags.join('\n')}

<page-data>${JSON.stringify(data)}</page-data>
  `

  return result
}
