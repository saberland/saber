import fs from 'fs'
import path from 'path'

export default () => {
  const pkg = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, '../../packages/saber/package.json'),
      'utf8'
    )
  )
  return JSON.stringify(pkg.version)
}
