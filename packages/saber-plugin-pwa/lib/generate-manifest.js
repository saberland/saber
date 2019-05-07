module.exports = async (api, { name, themeColor }) => {
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
        start_url: '/index.html',
        display: 'standalone',
        theme_color: themeColor,
        background_color: '#ffffff'
      },
      existingManifest
    ),
    null,
    2
  )

  log.info(`Generating manifest.json`)
  await fs.outputFile(manifestPath, newManifest, 'utf8')
}
