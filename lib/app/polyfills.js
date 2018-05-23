/* globals window, Object */

if (process.browser) {
  window.Promise = window.Promise || require('promise-polyfill')
  Object.assign = require('object-assign')
}
