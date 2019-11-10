const path = require('path')
const { spawnSync } = require('child_process')
const { fs } = require('saber-utils')
const { log } = require('saber-log')
const normalizeRepo = require('normalize-repo')
const downloadGitRepo = require('download-git-repo')
const configLoader = require('../utils/configLoader')
const resolvePackage = require('../utils/resolvePackage')
const { handleError, spawn } = require('./utils')

const downloadRepo = (url, dest, opts) =>
  new Promise(resolve => downloadGitRepo(url, dest, opts, resolve))

module.exports = function(cli) {
  cli
    .command(
      'eject-theme [app-path]',
      `Copy the currently used theme's source code to a local folder.`
    )
    .option(
      '--git',
      'Pull code from Git, instead of node_modules, and add the theme as a submodule',
      { default: false }
    )
    .option(
      '--merge-dependencies',
      "Copy over the theme's dependencies to your project's package.json.",
      { default: true }
    )
    .option('--path <path>', 'Ejected theme destination', {
      default: './theme'
    })
    .action(
      handleError(async (cwd = '.', options) => {
        cwd = path.resolve(cwd)
        const { git } = options
        const mergeDependencies = options['merge-dependencies']

        const config =
          configLoader.load({ cwd, files: configLoader.CONFIG_FILES }).data ||
          {}
        if (!config.theme) {
          throw new Error('No theme specified in config.')
        }

        const destPath = path.join(cwd, options.path)
        const relativeDest = path.relative(cwd, destPath)
        if (await fs.pathExists(destPath)) {
          throw new Error(
            `The path ${options.path} already exists. Please specify a different one using "--path".`
          )
        }

        const themePath = resolvePackage(config.theme, {
          prefix: 'saber-theme-',
          cwd
        })
        if (!themePath) {
          throw new Error(
            `Theme "${config.theme}" could not be found in your node_modules.`
          )
        }

        const themePackage = configLoader.load({
          cwd: themePath,
          files: ['package.json']
        }).data

        if (git) {
          const repo = themePackage.repository

          if (repo && (!repo.type || repo.type === 'git')) {
            const tmp = path.join(cwd, '.saber', 'theme-tmp')

            const { shortcut, url } = normalizeRepo(themePackage.repository)
            const downloadError = await downloadRepo(shortcut || url, tmp, {
              clone: Boolean(shortcut)
            })

            if (downloadError) {
              throw downloadError
            }

            await fs.move(
              repo.directory ? path.join(tmp, repo.directory) : tmp,
              destPath
            )

            await fs.remove(tmp)

            log.success('Downloaded theme source via Git.')
          } else {
            throw new Error(
              'The theme has no git repository specified within its package.json.'
            )
          }
        } else {
          await fs.copy(themePath, destPath, {
            filter: src => !src.endsWith('/node_modules')
          })

          log.info('Copied theme from node_modules.')
        }

        if (mergeDependencies) {
          const dependencies = themePackage.dependencies || {}
          const devDependencies = themePackage.devDependencies || {}

          const projectPackage = configLoader.load({
            cwd,
            files: ['package.json']
          }).data

          await fs.writeJson(
            path.join(cwd, 'package.json'),
            {
              ...projectPackage,
              dependencies: {
                ...projectPackage.dependencies,
                ...dependencies,
                [themePackage.name]: undefined // remove theme from dependencies
              },
              devDependencies: {
                ...projectPackage.devDependencies,
                ...devDependencies,
                [themePackage.name]: undefined // remove theme from dev dependencies
              }
            },
            { spaces: 2 }
          )

          const { status } = spawnSync('yarnpkg', ['--version']) // test if yarn is present before allowing it to use the same stdio
          const hasNpmLock = await fs.pathExists(
            path.join(cwd, 'package-lock.json')
          )
          if (status === 0 && !hasNpmLock) {
            await spawn('yarn', ['install'], { stdio: 'inherit' })
          } else {
            await spawn('npm', ['install'], { stdio: 'inherit' })
          }

          log.success('Merged theme dependencies.')
        }

        log.info(
          `Please change "theme" in your Saber config to "./${relativeDest}".`
        )
      })
    )
}
