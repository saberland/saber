module.exports = async function() {
  const done = this.async()
  const { api } = this.query
  const { method, args } = JSON.parse(this.resourceQuery.slice(1))
  const saberRequestFile = api.resolveCwd('saber-request.js')
  this.addDependency(saberRequestFile)

  // Delete require cache
  delete require.cache[saberRequestFile]

  let requestHandler = api.requestHandlers[method]

  try {
    if (!requestHandler) {
      requestHandler = require(saberRequestFile)[method]

      if (!requestHandler) {
        throw new Error(
          `method "${method}" does not exist in ${saberRequestFile}`
        )
      }
    }

    const result = await requestHandler.apply(api, args)
    done(null, JSON.stringify(result))
  } catch (error) {
    done(error)
  }
}
