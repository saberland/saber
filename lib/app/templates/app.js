const slash = require('slash')

module.exports = api => {
  const enhanceAppFiles = [...api.enhanceAppFiles].map((file, index) => ({
    name: `__enhanceApp${index}__`,
    path: file
  }))

  return `
  import '#app/polyfills'
  import Vue from 'vue'
  import router from '#app/router'

  let appEnhance
  const r = require.context('#base', false, /saber\\.app\\.js$/)
  r.keys().forEach(file => {
    appEnhance = r(file).default
  })

  ${enhanceAppFiles
    .map(file => `const ${file.name} = require('${slash(file.path)}').default`)
    .join('\n')}

  const rootOptions = {
    router,
    render: h => h('div', {
      attrs: {
        id: '__saber'
      }
    }, [h('router-view')])
  }

  const enhanceAppContext = { router, rootOptions }

  if (appEnhance) {
    appEnhance(enhanceAppContext)
  }

  ${enhanceAppFiles
    .map(
      file =>
        `typeof ${file.name} === 'function' ? ${
          file.name
        }(enhanceAppContext) : ''`
    )
    .join('\n')}

  const app = new Vue(rootOptions)

  export default {
    app,
    router
  }

  `
}
