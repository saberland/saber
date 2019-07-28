const path = require('path')
const fs = require('fs-extra')
const glob = require('fast-glob')

const files = glob.sync('*.js', { cwd: './src', absolute: true })

main().catch(error => {
  console.error(error)
  process.exitCode = 1
})

async function main() {
  for (const file of files) {
    const res = await require('@zeit/ncc')(path.normalize(file), {
      minify: true,
      sourceMap: false,
      watch: false
    })
    await fs.outputFile(
      path.join(__dirname, 'dist', path.basename(file)),
      res.code,
      'utf8'
    )
  }

  await fs.outputFile(
    path.join(__dirname, 'dist/index.js'),
    `
  module.exports = { ${files
    .map(file => {
      const name = path.basename(file, path.extname(file))
      return `get ${name}() { return require('./${name}') }`
    })
    .join(',')}
  }
  `,
    'utf8'
  )
}
