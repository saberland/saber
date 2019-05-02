if (process.browser) {
  window.Promise = window.Promise || require('./vendor/promise')
  Object.assign = require('object-assign')
}
