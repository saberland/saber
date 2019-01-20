module.exports = ({ types: t }) => {
  return {
    visitor: {
      StringLiteral(
        path,
        {
          file: {
            opts: { filename }
          }
        }
      ) {
        if (
          filename.endsWith('/html_re.js') &&
          path.node.value === '[a-zA-Z_:][a-zA-Z0-9:._-]*'
        ) {
          console.log('support @ in attribute names!')
          path.node.value = '[a-zA-Z@_:][a-zA-Z0-9:._-]*'
        }
      },
      ArrayExpression(path) {
        if (
          path.parent.type === 'VariableDeclarator' &&
          path.parent.id.name === 'HTML_SEQUENCES'
        ) {
          console.log('support top-level components')
          path.node.elements.push(
            // PascalCase Components
            t.ArrayExpression([
              t.RegExpLiteral('^<[A-Z]'),
              t.RegExpLiteral('>'),
              t.booleanLiteral(true)
            ]),
            // custom elements with hyphens
            t.ArrayExpression([
              t.RegExpLiteral('^<w+\\-'),
              t.RegExpLiteral('>'),
              t.booleanLiteral(true)
            ])
          )
        }
      }
    }
  }
}
