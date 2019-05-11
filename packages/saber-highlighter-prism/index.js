const Prism = require('prismjs')
const { log } = require('saber-log')
const loadLanguages = require('./loadLanguages')

module.exports = (code, lang) => {
  if (!lang) return Prism.highlight(code, {})

  lang = lang.toLowerCase()

  if (lang === 'vue') {
    lang = 'html'
  }

  if (!Prism.languages[lang]) {
    try {
      loadLanguages(lang)
    } catch (error) {
      log.warn(error.message)
      return Prism.highlight(code, {})
    }
  }

  const grammer = Prism.languages[lang]

  return Prism.highlight(code, grammer, lang)
}
