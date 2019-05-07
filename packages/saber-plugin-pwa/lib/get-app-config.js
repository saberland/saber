const defaults = {
  name: 'Saber PWA App',
  themeColor: '#3880ff', // saber.land theme color
  msTileColor: '#000000',
  appleMobileWebAppCapable: 'no',
  appleMobileWebAppStatusBarStyle: 'default',
  assetsVersion: '',
  iconPaths: {
    appleTouchIcon: 'img/icons/apple-touch-icon-152x152.png',
    safariMaskIcon: 'img/icons/safari-mask-icon.svg',
    msTileImage: 'img/icons/msapplication-icon-144x144.png'
  }
}

module.exports = (config = {}) => {
  return Object.assign({}, defaults, config, {
    iconPaths: Object.assign({}, defaults.iconPaths, config.iconPaths),
    name: config.name || defaults.name
  })
}
