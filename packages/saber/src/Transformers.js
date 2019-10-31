module.exports = class Transformers {
  constructor() {
    this.transformers = new Map()
  }

  get parseFrontmatter() {
    return require('./utils/parseFrontmatter')
  }

  add(contentType, transformer) {
    this.transformers.set(contentType, transformer)
  }

  get(contentType) {
    return this.transformers.get(contentType)
  }

  get supportedExtensions() {
    let extensions = []
    for (const transformer of this.transformers.values()) {
      extensions = [...extensions, ...(transformer.extensions || [])]
    }

    return extensions
  }

  getContentTypeByExtension(extension) {
    for (const [contentType, transformer] of this.transformers.entries()) {
      if (
        transformer.extensions &&
        transformer.extensions.includes(extension)
      ) {
        return contentType
      }
    }
  }
}
