const fs = require('fs')
const path = require('path')

const resetScript = fs.readFileSync(path.join(__dirname, 'noop-sw.js'), 'utf-8')

module.exports = function() {
  return function(req, res, next) {
    if (req.url === '/sw.js') {
      res.setHeader('Content-Type', 'text/javascript')
      res.send(resetScript)
    } else {
      next()
    }
  }
}
