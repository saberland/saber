exports.onCreatePage = function(page) {
  if (page.attributes.permalink === '/') {
    page.attributes.foo = 'ass'
  }
}
