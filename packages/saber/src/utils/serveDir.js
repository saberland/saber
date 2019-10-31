const path = require('path')
const { createReadStream } = require('fs')
const { log } = require('saber-log')
const polka = require('polka')
const serveStatic = require('serve-static')

module.exports = function({ dir, host, port } = {}) {
  const server = polka()
  server.use(serveStatic(dir))
  server.use(async (req, res, next) => {
    if (req.method !== 'GET') return next()
    createReadStream(path.join(dir, '404.html')).pipe(res)
  })
  server.listen(port, host)
  const outputHost = host === '0.0.0.0' ? 'localhost' : host
  log.info(`Your application is served at http://${outputHost}:${port}`)
}
