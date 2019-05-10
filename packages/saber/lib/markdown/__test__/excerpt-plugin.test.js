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
  expect(page.fields.excerpt).toBe('<p>hello</p>\n')
})

test('already have excerpt', () => {
  const md = new Markdown()
  const { env, page } = createEnv()
  page.excerpt = 'hehe'
  md.use(excerptPlugin)
  md.render(
    `
hello
  `,
    env
  )
  expect(page.fields.excerpt).toBe('hehe')
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
  expect(page.fields.excerpt).toBe('<p>hello</p>\n<p>world</p>\n')
})
