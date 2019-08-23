const { join } = require('path')

module.exports = () => {
  return {
    plugins: [handleSaberFunctions]
  }
}

function handleSaberFunctions({ types: t }) {
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

          if (specifier.imported.name === 'runFunction') {
            const binding = path.scope.getBinding(specifier.local.name)
            for (let i = 0; i < binding.referencePaths.length; i++) {
              const ref = binding.referencePaths[i].parentPath
              const url = ref.get('arguments.0').evaluate().value
              const [name, query = ''] = url.split('?')
              ref.replaceWith(
                t.callExpression(t.identifier('require'), [
                  t.stringLiteral(
                    `${join(
                      __dirname,
                      '../webpack/function-placeholder'
                    )}?functionName=${name}&${query}`
                  )
                ])
              )
            }
          }
        }

        path.remove()
      }
    }
  }
}
