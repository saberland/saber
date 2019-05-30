module.exports = async (api, { name, themeColor, manifest }) => {
  const { log } = api
  const { fs } = api.utils

  const newManifest = JSON.stringify(
    Object.assign(
      {
        short_name: name,
        name,
        start_url: './',
        display: 'standalone',
        theme_color: themeColor,
        background_color: '#ffffff'
      },
      manifest
    ),
    null,
    2
  )

  log.info(`Generating manifest.json`)
  await fs.outputFile(api.resolveOutDir('manifest.json'), newManifest, 'utf8')
}
