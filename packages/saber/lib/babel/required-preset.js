const { join } = require('path')

module.exports = () => {
  return {
    plugins: [handleSaberFunctions]
  }
}

function handleSaberFunctions({ types: t }) {
  const placeholder = join(__dirname, '../webpack/function-placeholder')

  return {
    visitor: {
      ImportDeclaration(path) {
        if (path.node.source.value !== 'saber/functions') {
          return
        }

        for (const specifier of path.node.specifiers) {
          if (specifier.type !== 'ImportSpecifier') {
            continue
          }

          const binding = path.scope.getBinding(specifier.local.name)
          for (let i = 0; i < binding.referencePaths.length; i++) {
            const ref = binding.referencePaths[i].parentPath
            const { name } = ref.node.callee
            const args = ref.node.arguments.map((_, i) => {
              const res = ref.get(`arguments.${i}`).evaluate()
              if (!res.confident) {
                throw new Error(
                  `Cannot evaluate arguments when calling function "${name}"`
                )
              }

              return res.value
            })
            const query = { args, name }
            ref.replaceWith(
              t.callExpression(t.identifier('require'), [
                t.stringLiteral(`${placeholder}?${JSON.stringify(query)}`)
              ])
            )
          }
        }

        path.remove()
      }
    }
  }
}
