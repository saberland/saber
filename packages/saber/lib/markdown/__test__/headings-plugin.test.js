const Markdown = require('saber-markdown')
const headingsPlugin = require('../headings-plugin')
const createEnv = require('./create-env')

const input = `
# Heading

## \`Heading\`

### [This time around, a link is present](http://localhost)

#### Deep on so many levels!

##### Still in there`

test('inject markdown headings enabled by default', () => {
  const md = new Markdown()
  const { env, page } = createEnv()
  md.use(headingsPlugin)
  md.render(input, env)
  expect(page.markdownHeadings).toEqual([
    {
      text: 'Heading',
      slug: 'heading',
      level: 1
    },
    {
      text: 'Heading',
      slug: 'heading-2',
      level: 2
    },
    {
      text: 'This time around, a link is present',
      slug: 'this-time-around-a-link-is-present',
      level: 3
    },
    {
      text: 'Deep on so many levels!',
      slug: 'deep-on-so-many-levels',
      level: 4
    },
    {
      text: 'Still in there',
      slug: 'still-in-there',
      level: 5
    }
  ])
})

test('inject markdown headings disabled', () => {
  const md = new Markdown()
  const { env, page } = createEnv()
  page.markdownHeadings = false
  md.use(headingsPlugin)
  md.render(input, env)
  expect(page.markdownHeadings).toEqual([])
})
