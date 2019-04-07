if (process.browser) {
  window.Promise = window.Promise || require('./vendor/promise')
}
