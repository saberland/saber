const path = require('path')
const { glob, fs, slash } = require('saber-utils')

const ID = 'builtin:layouts'

exports.name = ID

exports.apply = api => {
  const setLayout = (layouts, filepath, shouldDelete) => {
    const layoutName = path.basename(filepath, path.extname(filepath))
    if (shouldDelete) {
      delete layouts[layoutName]
    } else {
      layouts[layoutName] = slash(filepath)
    }
  }

  const getLayouts = async dir => {
    const files = await glob('*.{vue,js}', {
      cwd: dir
    })
    const layouts = {}
    files.forEach(file => {
      setLayout(layouts, path.join(dir, file))
    })
    return layouts
  }

  const writeLayouts = async (themeLayouts, userLayouts) => {
    const layouts = Object.assign({}, themeLayouts, userLayouts)

    const outFile = api.resolveCache('layouts.js')
    const outContent = `var layouts = {}

    ${Object.keys(layouts)
      .map((name, index) => {
        return `
      import layout_${index} from "${layouts[name]}"
      layouts["${name}"] = layout_${index}
      `
      })
      .join('\n')}

    export default layouts`
    await fs.outputFile(outFile, outContent, 'utf8')
  }

  api.hooks.beforeRun.tapPromise(ID, async () => {
    const themeLayoutsDir = path.join(api.theme, 'layouts')
    const userLayoutsDir = api.resolveCwd('layouts')
    const [themeLayouts, userLayouts] = await Promise.all([
      getLayouts(themeLayoutsDir),
      getLayouts(userLayoutsDir)
    ])
    await writeLayouts(themeLayouts, userLayouts)

    if (api.dev) {
      const watchLayouts = (dir, layouts) => {
        const chokidar = require('chokidar')

        // Clear the layouts object when the layouts directory is removed
        chokidar
          .watch('.', {
            cwd: dir,
            disableGlobbing: true,
            ignored(filepath) {
              return filepath !== dir
            },
            ignoreInitial: true
          })
          .on('unlinkDir', async dir => {
            if (!dir) {
              Object.keys(layouts).forEach(name => {
                delete layouts[name]
              })
              await writeLayouts(themeLayouts, userLayouts)
            }
          })

        // Add/Remove layout components
        chokidar
          .watch('*.{vue,js}', { cwd: dir, ignoreInitial: true })
          .on('add', async file => {
            setLayout(layouts, path.join(dir, file))
            await writeLayouts(themeLayouts, userLayouts)
          })
          .on('unlink', async file => {
            setLayout(layouts, path.join(dir, file), true)
            await writeLayouts(themeLayouts, userLayouts)
          })
      }

      // No need to watch theme layouts if it's from an npm package
      if (!/node_modules/.test(themeLayoutsDir)) {
        watchLayouts(themeLayoutsDir, themeLayouts)
      }

      watchLayouts(userLayoutsDir, userLayouts)
    }
  })
}
