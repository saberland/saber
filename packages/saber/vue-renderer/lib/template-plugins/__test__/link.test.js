const posthtml = require('posthtml')
const plugin = require('../link')

const transform = source =>
  posthtml([plugin()])
    .process(source, {
      recognizeSelfClosing: true
    })
    .then(res => res.html)

test('basic', async () => {
  const html = await transform(`
  <a href="foo">foo</a>
  <a href="https://example.com">foo</a>
  <a href="mailto:i@example.com">foo</a>
  <saber-link to="/foo">foo</saber-link>
  <saber-link :to="foo">foo</saber-link>
  `)
  expect(html).toBe(`
  <saber-link :to="$saber.getPageLink('foo')">foo</saber-link>
  <a target="_blank" rel="noopener noreferrer" href="https://example.com">foo</a>
  <a href="mailto:i@example.com">foo</a>
  <saber-link :to="$saber.getPageLink('/foo')">foo</saber-link>
  <saber-link :to="foo">foo</saber-link>
  `)
})

test('ignore', async () => {
  const html = await transform(`<a href="foo" saber-ignore>foo</a>`)
  expect(html).toBe(`<a href="foo">foo</a>`)
})
