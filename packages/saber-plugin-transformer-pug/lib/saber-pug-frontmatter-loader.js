const parseFrontmatter = require('../../saber/lib/utils/parseFrontmatter')

module.exports = function(source) {
  const { body } = parseFrontmatter(source)

  return body
}
