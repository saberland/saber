const Markdown = require('saber-markdown')
const fenceOptionsPlugin = require('../highlight-plugin')
const createEnv = require('./create-env')

test('main', () => {
  const md = new Markdown()
  const { env } = createEnv()
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
