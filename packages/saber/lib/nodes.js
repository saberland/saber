const Loki = require('lokijs')

const db = new Loki()

const nodes = db.addCollection('nodes', {
  unique: ['id']
})

module.exports = nodes
