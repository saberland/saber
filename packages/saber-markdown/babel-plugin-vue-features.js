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
          // Using Vue components at top-level
          // Previously `<foo-bar>` is transformed to `<p><foo-bar></p>`
          // Now it's just `<foo-bar>`
          console.log('support top-level components')
          path.node.elements = [
            ...path.node.elements.slice(0, -2),
            // PascalCase Components
            t.arrayExpression([
              t.regExpLiteral('^<[A-Z]'),
              t.regExpLiteral('>'),
              t.booleanLiteral(true)
            ]),
            // custom elements with hyphens
            t.arrayExpression([
              t.regExpLiteral('^<\\w+\\-'),
              t.regExpLiteral('>'),
              t.booleanLiteral(true)
            ]),
            ...path.node.elements.slice(-2)
          ]
        }
      }
    }
  }
}
