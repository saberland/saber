const querystring = require('querystring')

module.exports = async function() {
  const done = this.async()
  const { api } = this.query
  const query = querystring.parse(this.resourceQuery.slice(1))
  try {
    const result = await api.functions.run(query.functionName, query)
    done(null, JSON.stringify(result))
  } catch (error) {
    done(error)
  }
}
