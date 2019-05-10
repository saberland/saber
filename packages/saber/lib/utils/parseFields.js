const path = require('path')
const resolveFrom = require('resolve-from')

const babelDir = path.dirname(require.resolve('@babel/core/package'))
const parser = require(resolveFrom(babelDir, '@babel/parser'))
const traverse = require(resolveFrom(babelDir, '@babel/traverse'))
const generator = require(resolveFrom(babelDir, '@babel/generator'))

module.exports = (content, filepath) => {
  const ast = parser.parse(content, {
    sourceFilename: filepath,
    sourceType: 'module',
    plugins: ['typescript', 'jsx', 'objectRestSpread', 'classProperties']
  })

  let fields = {}

  traverse.default(ast, {
    ObjectExpression(path) {
      const isFields =
        path.parent &&
        path.parent.type === 'VariableDeclarator' &&
        path.parent.id.name === 'fields'
      const isConstFields =
        isFields &&
        path.parentPath.parent &&
        path.parentPath.parent.kind === 'const'
      const isExportedConstFields =
        isConstFields &&
        path.parentPath.parentPath &&
        path.parentPath.parentPath.parent.type === 'ExportNamedDeclaration'
      if (isExportedConstFields) {
        const { confident, value } = path.evaluate()
        if (confident) {
          fields = value
          path.node.properties = []
        } else {
          throw new Error(
            `"fields" is supposed to have the same value when executed in runtime and build time.`
          )
        }
      }
    }
  })

  const { code } = generator.default(ast)

  return {
    fields,
    code
  }
}
