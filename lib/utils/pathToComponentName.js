const slash = require('slash')

const alphanumeric = v => v.replace(/[^\w-]/g, '-')

module.exports = path => {
  path = slash(path)

  if (path.charAt(path.length - 1) === '/') {
    return alphanumeric(`page--${path.replace(/\//g, '-') + 'index'}`)
  }
  return alphanumeric(`page--${path.replace(/\//g, '-').replace(/\.\w+$/, '')}`)
}
