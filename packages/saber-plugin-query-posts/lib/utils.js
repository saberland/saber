const slugify = require('slugo')

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

/**
 * Render permalink template
 * @param {string} permalink
 * @param {{[k:string]: string}} data
 */
function renderPermalink(permalink, data) {
  for (const key of Object.keys(data)) {
    permalink = permalink.replace(`:${key}`, data[key])
  }

  return permalink
}

module.exports = {
  getIdFromMap,
  getNameFromMap,
  renderPermalink
}
