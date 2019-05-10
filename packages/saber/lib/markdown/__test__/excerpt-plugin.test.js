const Markdown = require('saber-markdown')
const excerptPlugin = require('../excerpt-plugin')
const createEnv = require('./create-env')

test('simple', () => {
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

test('disable excerpt', () => {
  const md = new Markdown()
  const { env, page } = createEnv()
  page.attributes.excerpt = false
  md.use(excerptPlugin)
  md.render(
    `
hello
  `,
    env
  )
  expect(page.excerpt).toBe(undefined)
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
