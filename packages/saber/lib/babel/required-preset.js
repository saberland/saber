const { join } = require('path')

module.exports = () => {
  return {
    plugins: [handleSaberRequest]
  }
}

function handleSaberRequest({ types: t }) {
  return {
    name: 'saber-request',
    visitor: {
      ImportDeclaration(path) {
        if (path.node.source.value !== 'saber/request') {
          return
        }

        for (const specifier of path.node.specifiers) {
          if (specifier.type !== 'ImportDefaultSpecifier') {
            continue
          }
          const binding = path.scope.getBinding(specifier.local.name)
          for (let i = 0; i < binding.referencePaths.length; i++) {
            const ref = binding.referencePaths[i].parentPath
            if (ref.node.type !== 'MemberExpression') {
              throw new Error(
                `You should use saber/request as an object instead of ${
                  ref.node.type
                }`
              )
            }
            const method = ref.node.property.name
            const args = []
            for (const arg of ref.parentPath.get('arguments')) {
              const result = arg.evaluate()
              if (!result.confident) {
                throw new Error(
                  `The argument of saber/request must be literals`
                )
              }
              args.push(result.value)
            }
            ref.parentPath.replaceWith(
              t.callExpression(t.identifier('require'), [
                t.stringLiteral(
                  `${join(
                    __dirname,
                    '../webpack/request-loader-placeholder'
                  )}?${JSON.stringify({ method, args })}`
                )
              ])
            )
          }
        }

        path.remove()
      }
    }
  }
}
