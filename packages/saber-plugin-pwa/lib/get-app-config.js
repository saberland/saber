const defaults = {
  name: 'Saber PWA App',
  themeColor: '#ffffff',
  assetsVersion: ''
}

module.exports = (config = {}) => {
  return Object.assign({}, defaults, config, {
    name: config.name || defaults.name
  })
}
