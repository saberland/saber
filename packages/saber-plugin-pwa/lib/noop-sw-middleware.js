const resetScript = `
self.addEventListener('install', function(e) {
  self.skipWaiting()
})

self.addEventListener('activate', function(e) {
  self.registration
    .unregister()
    .then(function() {
      return self.clients.matchAll()
    })
    .then(function(clients) {
      clients.forEach(client => client.navigate(client.url))
    })
})
`

module.exports = () => (req, res, next) => {
  if (req.path === '/service-worker.js') {
    res.setHeader('Content-Type', 'text/javascript')
    res.end(resetScript)
  } else {
    next()
  }
}
