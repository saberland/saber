function paginate(arr, options) {
  options = Object.assign({ perPage: 30 }, options)
  const totalPages = Math.ceil(arr.length / options.perPage)
  const result = []
  for (let i = 0; i < totalPages; i++) {
    result[i] = arr.slice(i * options.perPage, (i + 1) * options.perPage)
  }
  return result
}

module.exports = {
  paginate
}
