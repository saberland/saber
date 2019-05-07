const defaults = {
  name: 'Saber PWA App',
  themeColor: '#3880ff', // saber.land theme color
  msTileColor: '#000000',
  appleMobileWebAppCapable: 'no',
  appleMobileWebAppStatusBarStyle: 'default',
  assetsVersion: '',
  iconPaths: {
    favicon16: 'img/icons/favicon-16x16.png',
    favicon32: 'img/icons/favicon-32x32.png',
    appleTouchIcon: 'img/icons/apple-touch-icon-152x152.png',
    safariMaskIcon: 'img/icons/safari-mask-icon.svg',
    msTileImage: 'img/icons/msapplication-icon-144x144.png'
  }
}

module.exports = async (api, manifestOptions = {}) => {
  const {
    name,
    themeColor,
    msTileColor,
    appleMobileWebAppCapable,
    appleMobileWebAppStatusBarStyle,
    assetsVersion,
    iconPaths
  } = Object.assign({}, defaults, manifestOptions, {
    iconPaths: Object.assign({}, defaults.iconPaths, manifestOptions.icons)
  })

  const { log } = api
  const { fs } = api.utils

  const manifestPath = api.resolveOutDir('manifest.json')
  const hasManifest = await fs.pathExists(manifestPath)
  const existingManifest = hasManifest ? require(manifestPath) : {}

  const newManifest = JSON.stringify(
    Object.assign(
      {
        short_name: name,
        name,
        icons: [
          iconPaths.favicon16 && {
            src: iconPaths.favicon16,
            sizes: '16x16',
            type: 'image/png'
          },
          iconPaths.favicon32 && {
            src: iconPaths.favicon32,
            sizes: '32x32',
            type: 'image/png'
          }
        ].filter(Boolean),
        start_url: '.',
        display: 'standalone',
        theme_color: themeColor,
        background_color: '#ffffff'
      },
      existingManifest
    ),
    null,
    2
  )

  log.info(`Generating manifest.json (update)`)
  await fs.outputFile(manifestPath, newManifest, 'utf8')
}
