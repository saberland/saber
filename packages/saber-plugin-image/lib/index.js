const { join } = require('path')
const { parse } = require('querystring')

const ID = 'images'

exports.name = ID

exports.apply = (api, options = {}) => {
  options = Object.assign(
    {
      lazyLoad: true,
      placeholder: true,
      blendIn: true,
      markdownImages: true
    },
    options
  )

  api.browserApi.add(join(__dirname, 'saber-browser.js'))

  api.renderer.hooks.getVueLoaderOptions.tap(ID, options => {
    options.transformAssetUrls = Object.assign({}, options.transformAssetUrls, {
      'saber-image': ['src']
    })
    return options
  })

  if (options.markdownImages) {
    api.hooks.chainMarkdown.tap(ID, config => {
      config.plugin(ID).use(md => {
        md.core.ruler.push(ID, state => {
          const { tokens } = state

          for (const token of tokens) {
            if (token.type === 'inline' && token.children) {
              const { children } = token

              // clone children to avoid an infinite loop
              for (const child of [...children]) {
                if (child.type === 'image' || child.tag === 'img') {
                  child.tag = 'saber-image'
                  child.nesting = 1

                  const src = child.attrGet('src')
                  const querystring = parse(src.split('?')[1])
                  Object.keys(querystring).forEach(key => {
                    const query = querystring[key]
                    if (query === 'true') querystring[key] = true
                    if (query === 'false') querystring[key] = false
                  })
                  child.attrSet('data-lazy', JSON.stringify(querystring))

                  // append closing tag for saber-image
                  children.splice(
                    children.indexOf(child) + 1,
                    0,
                    new state.Token('image_close', 'saber-image', -1)
                  )
                }
              }
            }
          }
        })
      })
    })
  }

  api.hooks.chainWebpack.tap(ID, config => {
    config.plugin('constants').tap(([constants]) => [
      Object.assign(constants, {
        __SABER_IMAGE_OPTIONS__: options
      })
    ])

    config.module.rule('image').exclude.add(/\.(jpe?g|png)$/i)

    config.module
      .rule(ID)
      .test(/\.(jpe?g|png)$/i)
      .use('responsive-loader')
      .loader(require.resolve('responsive-loader'))
      .options(options)
  })
}
