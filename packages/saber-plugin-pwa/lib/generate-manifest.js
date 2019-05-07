module.exports = async (api, { name, themeColor, iconPaths }) => {
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
