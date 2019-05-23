module.exports = function({ template, types: t }) {
  return {
    visitor: {
      ImportDeclaration(nodePath) {
        const specifiers = nodePath.get('specifiers')
        if (specifiers && specifiers.length > 0) {
          specifiers.forEach((spec, index) => {
            const importedModule = spec.parent.source.value
            const varName = spec.node.local.name
            if (importedModule === 'saber/data') {
              const buildRequire = template(`import IMPORT_NAME from 'SOURCE'`)
              const newNode = buildRequire({
                IMPORT_NAME: t.identifier(varName),
                SOURCE: t.stringLiteral(
                  importedModule.replace('saber', '#cache') +
                    '.js?name=' +
                    varName
                )
              })
              if (index) {
                nodePath.insertAfter(newNode)
              } else {
                nodePath.replaceWith(newNode)
              }
            }
          })
        }
      }
    }
  }
}
