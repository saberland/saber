const Markdown = require('saber-markdown')
const headingsPlugin = require('../headings-plugin')
const createEnv = require('./create-env')

const input = `
# Heading

## \`Another heading\`

### [This time around, a link is present](http://localhost)

#### Deep on so many levels!

##### Still in there

###### h6 masterrace`

test('inject markdown headings enabled', () => {
  const md = new Markdown()
  const { env } = createEnv()
  env.setAttribute('injectMarkdownHeadings', true)
  md.use(headingsPlugin)
  md.render(input, env)
  expect(env.getAttribute('markdownHeadings')).toEqual(
    // by default, h2~h5 are injected
    expect.arrayContaining([
      {
        text: 'Another heading',
        slug: 'another-heading',
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
  )
})

test('inject markdown headings enabled', () => {
  const md = new Markdown()
  const { env } = createEnv()
  env.setAttribute('injectMarkdownHeadings', [1, 3, 5, 6]) // inject level h1, h3, h5 and h6
  md.use(headingsPlugin)
  md.render(input, env)
  expect(env.getAttribute('markdownHeadings')).toEqual(
    // by default, h2~h5 are injected
    expect.arrayContaining([
      {
        text: 'Heading',
        slug: 'heading',
        level: 1
      },
      {
        text: 'This time around, a link is present',
        slug: 'this-time-around-a-link-is-present',
        level: 3
      },
      {
        text: 'Still in there',
        slug: 'still-in-there',
        level: 5
      },
      {
        text: 'h6 masterrace',
        slug: 'h6-masterrace',
        level: 6
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
