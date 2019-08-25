module.exports = async function() {
  const done = this.async()
  const { api } = this.query
  const { name, args } = JSON.parse(this.resourceQuery.slice(1))
  try {
    const result = await api.functions.run(name, args)
    done(null, JSON.stringify(result))
  } catch (error) {
    done(error)
  }
}
