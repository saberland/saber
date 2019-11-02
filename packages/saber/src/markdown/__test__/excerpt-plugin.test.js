const Markdown = require('saber-markdown')
const excerptPlugin = require('../excerpt-plugin')
const createEnv = require('./create-env')

test('use first paragraph as excerpt', () => {
  const md = new Markdown()
  const { env, page } = createEnv()
  md.use(excerptPlugin)
  md.render(
    `
hello
  `,
    env
  )
  expect(page.excerpt).toBe('<p>hello</p>\n')
})

test('do not override page excerpt', () => {
  const md = new Markdown()
  const { env, page } = createEnv({ excerpt: 'existing' })
  md.use(excerptPlugin)
  md.render(
    `
hello
  `,
    env
  )
  md.use(excerptPlugin)
  expect(page.excerpt).toBe('existing')
})

test('disable excerpt', () => {
  const md = new Markdown()
  const { env, page } = createEnv()
  page.excerpt = false
  md.use(excerptPlugin)
  md.render(
    `
hello
  `,
    env
  )
  expect(page.excerpt).toBe(false)
})

test('<!-- more --> mark', () => {
  const md = new Markdown({
    html: true
  })
  const { env, page } = createEnv()
  md.use(excerptPlugin)
  md.render(
    `
hello

world

<!-- more -->

wow
  `,
    env
  )
  expect(page.excerpt).toBe('<p>hello</p>\n<p>world</p>\n')
})
