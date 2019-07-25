exports.onCreatePage = function(page) {
  if (page.permalink === '/') {
    page.foo = 'ass'
  }
}
