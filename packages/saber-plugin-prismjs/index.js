const ID = 'prismjs'

exports.name = ID

exports.apply = api => {
  api.hooks.chainMarkdown.tap(ID, config => {
    config.options.highlight(require('saber-highlighter-prism'))
  })
}
