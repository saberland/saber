const Markdown = require('saber-markdown')
const fenceOptionsPlugin = require('./highlight-plugin')

test('main', () => {
  const md = new Markdown()
  const env = { hoistedTags: [] }
  md.use(fenceOptionsPlugin)
  const html = md.render(
    `
\`\`\`vue
<div>hehe</div>
\`\`\`
  `,
    env
  )
  expect(html).toMatchSnapshot()
})
