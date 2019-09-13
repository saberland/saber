const { prefixSpace } = require('./utils')

module.exports = context => {
  if (!context.metaInfo) {
    return {
      title: '',
      htmlAttrs: '',
      headAttrs: '',
      bodyAttrs: '',
      link: '',
      style: '',
      headScript: '',
      bodyScript: `<script src="/_saber/js/client.js" defer></script>`,
      noscript: '',
      meta: ''
    }
  }

  const {
    title,
    htmlAttrs,
    headAttrs,
    bodyAttrs,
    link,
    style,
    script,
    noscript,
    meta
  } = context.metaInfo.inject()

  const { dev } = context

  return {
    title: title.text(),
    htmlAttrs: `data-saber-ssr${prefixSpace(htmlAttrs.text())}`,
    headAttrs: headAttrs.text(),
    bodyAttrs: bodyAttrs.text(),
    link: link.text(),
    style: `${context.renderStyles()}${style.text()}`,
    headScript: script.text(),
    bodyScript: `${script.text({ body: true })}${context.renderScripts()}${
      dev ? '<script src="/_saber/dll/client.js"></script>' : ''
    }`,
    noscript: noscript.text(),
    meta: meta.text()
  }
}
