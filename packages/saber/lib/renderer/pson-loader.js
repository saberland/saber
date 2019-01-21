module.exports = function(source) {
  const data = JSON.parse(source)

  const { content, internal } = data
  delete data.content
  delete data.internal

  const result = `
<template>
  <layout-manager :page="$page">
  ${content}
  </layout-manager>
</template>

${internal.hoistedTags ? internal.hoistedTags.join('\n') : ''}

<page-data>${JSON.stringify(data)}</page-data>
  `

  return result
}
