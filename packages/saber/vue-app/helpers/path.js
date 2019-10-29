// eslint-disable
// Extracted from https://github.com/calvinmetcalf/rollup-plugin-node-builtins/blob/master/src/es6/path.js

function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  let up = 0
  for (let i = parts.length - 1; i >= 0; i--) {
    const last = parts[i]
    if (last === '.') {
      parts.splice(i, 1)
    } else if (last === '..') {
      parts.splice(i, 1)
      up++
    } else if (up) {
      parts.splice(i, 1)
      up--
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..')
    }
  }

  return parts
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
const splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/
const splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1)
}

// path.normalize(path)
// posix version
function normalize(path) {
  const isPathAbsolute = isAbsolute(path)
  const trailingSlash = path.substr(-1) === '/'

  // Normalize the path
  path = normalizeArray(path.split('/').filter(Boolean), !isPathAbsolute).join(
    '/'
  )

  if (!path && !isPathAbsolute) {
    path = '.'
  }

  if (path && trailingSlash) {
    path += '/'
  }

  return (isPathAbsolute ? '/' : '') + path
}

// posix version
function isAbsolute(path) {
  return path.charAt(0) === '/'
}

// posix version
function join(...paths) {
  return normalize(paths.filter(p => typeof p === 'string').join('/'))
}

function dirname(path) {
  const result = splitPath(path)
  const root = result[0]
  let dir = result[1]

  if (!root && !dir) {
    // No dirname whatsoever
    return '.'
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1)
  }

  return root + dir
}

export { dirname, join }
