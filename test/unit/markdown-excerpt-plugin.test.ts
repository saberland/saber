import Markdown from 'saber-markdown'
import excerptPlugin from 'saber/src/markdown/excerpt-plugin'
import { createMarkdownEnv } from './helpers/create-markdown-env'

test('use first paragraph as excerpt', () => {
  const md = new Markdown()
  const { env, page } = createMarkdownEnv()
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
  const { env, page } = createMarkdownEnv({ excerpt: 'existing' })
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
  const { env, page } = createMarkdownEnv()
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
  const { env, page } = createMarkdownEnv()
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
