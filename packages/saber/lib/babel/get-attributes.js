module.exports = () => {
  return {
    visitor: {
      ObjectExpression(path, { opts }) {
        const isAttributes =
          path.parent &&
          path.parent.type === 'VariableDeclarator' &&
          path.parent.id.name === 'attributes'
        const isConstAttributes =
          isAttributes &&
          path.parentPath.parent &&
          path.parentPath.parent.kind === 'const'
        const isExportedConstAttributes =
          isConstAttributes &&
          path.parentPath.parentPath &&
          path.parentPath.parentPath.parent.type === 'ExportNamedDeclaration'
        if (isExportedConstAttributes) {
          const { confident, value } = path.evaluate()
          if (confident) {
            opts.env.attributes = value
          } else {
            throw new Error(
              `"attributes" is supposed to have the same value when executed in runtime and build time.`
            )
          }
        }
      }
    }
  }
}
