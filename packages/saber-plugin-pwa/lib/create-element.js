const stringify = require('stringify-attributes')

module.exports = (tagName, attrs, content) => {
  const attrString = stringify(attrs)
  return content
    ? `<${tagName}${attrString}>${content}</${tagName}`
    : `<${tagName}${attrString} />`
}
