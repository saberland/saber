exports.onCreatePage = function(page) {
  if (page.fields.permalink === '/') {
    page.fields.foo = 'ass'
  }
}
