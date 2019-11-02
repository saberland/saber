import path from 'path'
import { glob, fs, slash } from 'saber-utils'
import { SaberPlugin } from '..'

interface Layouts {
  [name: string]: string
}

const ID = 'builtin:layouts'

const layoutsPlugin: SaberPlugin = {
  name: ID,

  apply(api) {
    const setLayout = (
      layouts: Layouts,
      filepath: string,
      shouldDelete?: boolean
    ) => {
      const layoutName = path.basename(filepath, path.extname(filepath))
      if (shouldDelete) {
        delete layouts[layoutName]
      } else {
        layouts[layoutName] = slash(filepath)
      }
    }

    const getLayouts = async (dir: string) => {
      const files = await glob('*.{vue,js}', {
        cwd: dir
      })
      const layouts = {}
      files.forEach(file => {
        setLayout(layouts, path.join(dir, file))
      })
      return layouts
    }

    const writeLayouts = async (
      themeLayouts: Layouts,
      userLayouts: Layouts
    ) => {
      const layouts = Object.assign({}, themeLayouts, userLayouts)

      api.log.verbose(() => `Found layouts: ${Object.keys(layouts).join(', ')}`)

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
        const watchLayouts = (dir: string, layouts: Layouts) => {
          const chokidar = require('chokidar')

          const onRemoveDir = async (dir: string) => {
            if (!dir) {
              Object.keys(layouts).forEach(name => {
                delete layouts[name]
              })
              await writeLayouts(themeLayouts, userLayouts)
            }
          }

          const onAddLayout = async (file: string) => {
            setLayout(layouts, path.join(dir, file))
            await writeLayouts(themeLayouts, userLayouts)
          }

          const onRemoveLayout = async (file: string) => {
            setLayout(layouts, path.join(dir, file), true)
            await writeLayouts(themeLayouts, userLayouts)
          }

          // Clear the layouts object when the layouts directory is removed
          chokidar
            .watch('.', {
              cwd: dir,
              disableGlobbing: true,
              ignored(filepath: string) {
                return filepath !== dir
              },
              ignoreInitial: true
            })
            .on('unlinkDir', (dir: string) => {
              onRemoveDir(dir)
            })

          // Add/Remove layout components
          chokidar
            .watch('*.{vue,js}', { cwd: dir, ignoreInitial: true })
            .on('add', (file: string) => {
              onAddLayout(file)
            })
            .on('unlink', (file: string) => {
              onRemoveLayout(file)
            })
        }

        // No need to watch theme layouts if it's from an npm package
        if (!themeLayoutsDir.includes('node_modules')) {
          watchLayouts(themeLayoutsDir, themeLayouts)
        }

        watchLayouts(userLayoutsDir, userLayouts)
      }
    })
  }
}

export default layoutsPlugin
