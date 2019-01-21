const Prism = require('prismjs')
const { log } = require('saber-log')
const loadLanguages = require('./loadLanguages')

module.exports = (code, lang) => {
  if (!lang) return Prism.highlight(code, {})

  if (lang === 'vue') {
    lang = 'html'
  }

  loadLanguages(lang)

  const grammer = Prism.languages[lang]

  if (!grammer) {
    log.debug(`Prism doesn't support the language "${lang}"`)
  }

  return Prism.highlight(code, grammer || {}, lang)
}
