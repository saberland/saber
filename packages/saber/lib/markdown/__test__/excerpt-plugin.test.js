const Markdown = require('saber-markdown')
const excerptPlugin = require('../excerpt-plugin')
const createEnv = require('./create-env')

test('simple', () => {
  const md = new Markdown()
  const { env } = createEnv()
  md.use(excerptPlugin)
  md.render(
    `
hello
  `,
    env
  )
  expect(env.getAttribute('excerpt')).toBe('<p>hello</p>\n')
})

test('already have excerpt', () => {
  const md = new Markdown()
  const { env } = createEnv()
  env.setAttribute('excerpt', 'hehe')
  md.use(excerptPlugin)
  md.render(
    `
hello
  `,
    env
  )
  expect(env.getAttribute('excerpt')).toBe('hehe')
})

test('<!-- more --> mark', () => {
  const md = new Markdown({
    html: true
  })
  const { env } = createEnv()
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
  expect(env.getAttribute('excerpt')).toBe('<p>hello</p>\n<p>world</p>\n')
})
