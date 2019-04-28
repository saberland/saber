const path = require('path')

const ID = 'builtin:inject-saber-highlight-css'

const cssPath = path.join(__dirname, '../markdown/saber-highlight.css')

exports.name = ID

exports.apply = api => {
  api.hooks.emitRoutes.tap(ID, async () => {
    let inject
    for (const page of api.pages.values()) {
      if (page.internal.injectSaberHighlightCSS) {
        inject = true
        break
      }
    }
    if (inject) {
      api.runtimePolyfills.add(cssPath)
    } else {
      api.runtimePolyfills.delete(cssPath)
    }
  })
}
