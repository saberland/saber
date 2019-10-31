const ConfigChain = require('../../config-chain')

module.exports = api => {
  const chain = new ConfigChain()
  const { template = {} } = api.config

  const builtInPlugins = [
    {
      name: 'link',
      resolve: require.resolve('./link'),
      options: {
        openLinkInNewTab:
          typeof template.openLinkInNewTab === 'boolean'
            ? template.openLinkInNewTab
            : true
      }
    }
  ]

  // Load built-in plugins
  chain.loadPlugins(builtInPlugins, api.configDir)

  api.hooks.chainTemplate.call(chain)

  // Load plugins from config file
  if (template.plugins) {
    chain.loadPlugins(template.plugins, api.configDir)
  }

  const { plugins } = chain.toConfig()

  return plugins.map(plugin => (tree, context) => {
    const transform = plugin.plugin(...plugin.args)
    return transform(tree, context)
  })
}
