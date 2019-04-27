// @ts-check

/**
 * @param {object} input
 * @return {string}
 */
module.exports = input => {
  const attributes = []

  for (const key of Object.keys(input)) {
    let value = input[key]

    if (value === false) {
      continue
    }

    if (Array.isArray(value)) {
      value = value.join(' ')
    }

    let attribute = key

    if (value !== true) {
      attribute += `="${value}"`
    }

    attributes.push(attribute)
  }

  return attributes.length > 0 ? ' ' + attributes.join(' ') : ''
}
