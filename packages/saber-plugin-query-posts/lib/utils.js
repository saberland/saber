const slugify = require('slugo')

function paginate(arr, options) {
  options = Object.assign({ perPage: 30 }, options)
  const totalPages = Math.ceil(arr.length / options.perPage)
  const result = []
  for (let i = 0; i < totalPages; i++) {
    result[i] = arr.slice(i * options.perPage, (i + 1) * options.perPage)
  }
  return result
}

function getIdFromMap(map, name) {
  let id
  if (map[name]) {
    id = map[name]
  } else {
    id = slugify(name.replace(/\//g, '-'))
    map[name] = id
  }
  return id
}

function getNameFromMap(map, id) {
  for (const name of Object.keys(map)) {
    if (map[name] === id) {
      return name
    }
  }
  return id
}

module.exports = {
  paginate,
  getIdFromMap,
  getNameFromMap
}
