module.exports = require('./dist')

/**
 * Convert back slash to slash
 */
module.exports.slash = input => input && input.replace(/\\/g, '/')
