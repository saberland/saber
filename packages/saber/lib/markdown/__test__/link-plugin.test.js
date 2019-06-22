const Markdown = require('saber-markdown')
const linkPlugin = require('../link-plugin')
const createEnv = require('./create-env')

test('simple', () => {
  const md = new Markdown()
  const { env } = createEnv()
  md.use(linkPlugin)
  const html = md.render(
    `
[ \`link c\` ](https://c)
[ \`link a\` ](a)
[ \`link b\` ](b)
  `,
    env
  )
  expect(html)
    .toBe(`<p><a href="https://c" target="_blank" rel="noopener noreferrer"> <code>link c</code> </a>
<saber-link to="a"> <code>link a</code> </saber-link>
<saber-link to="b"> <code>link b</code> </saber-link></p>
`)
})
