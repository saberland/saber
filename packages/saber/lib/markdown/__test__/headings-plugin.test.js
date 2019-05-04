const Markdown = require('saber-markdown')
const headingsPlugin = require('../headings-plugin')
const createEnv = require('./create-env')

const input = `# Heading

## Another heading

### [This time around, a link is present](http://localhost)`

test('inject markdown headings enabled', () => {
  const md = new Markdown()
  const { env } = createEnv()
  env.setAttribute('injectMarkdownHeadings', true)
  md.use(headingsPlugin)
  md.render(input, env)
  expect(env.getAttribute('markdownHeadings')).toEqual(
    expect.arrayContaining([
      {
        text: 'Heading',
        slug: 'heading'
      },
      {
        text: 'Another heading',
        slug: 'another-heading'
      },
      {
        text: 'This time around, a link is present',
        slug: 'this-time-around-a-link-is-present'
      }
    ])
  )
})

test('inject markdown headings disabled', () => {
  const md = new Markdown()
  const { env } = createEnv()
  md.use(headingsPlugin)
  md.render(input, env)
  expect(env.getAttribute('markdownHeadings')).toEqual(
    expect.arrayContaining([])
  )
})
