if (process.browser) {
  window.Promise = window.Promise || require('promise')
  Object.assign = require('object-assign')
}
