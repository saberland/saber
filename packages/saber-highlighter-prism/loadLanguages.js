/* globals Prism */
const components = require('prismjs/components.js')

let peerDependentsMap = null

function getPeerDependentsMap() {
  const peerDependentsMap = {}
  Object.keys(components.languages).forEach(language => {
    if (language === 'meta') {
      return false
    }
    if (components.languages[language].peerDependencies) {
      let { peerDependencies } = components.languages[language]
      if (!Array.isArray(peerDependencies)) {
        peerDependencies = [peerDependencies]
      }
      peerDependencies.forEach(peerDependency => {
        if (!peerDependentsMap[peerDependency]) {
          peerDependentsMap[peerDependency] = []
        }
        peerDependentsMap[peerDependency].push(language)
      })
    }
  })
  return peerDependentsMap
}

function getPeerDependents(mainLanguage) {
  if (!peerDependentsMap) {
    peerDependentsMap = getPeerDependentsMap()
  }
  return peerDependentsMap[mainLanguage] || []
}

function loadLanguages(arr, withoutDependencies) {
  // If no argument is passed, load all components
  if (!arr) {
    arr = Object.keys(components.languages).filter(language => {
      return language !== 'meta'
    })
  }
  if (arr && arr.length === 0) {
    return
  }

  if (!Array.isArray(arr)) {
    arr = [arr]
  }

  arr.forEach(language => {
    if (!components.languages[language]) {
      // Find the language by alias name
      for (const name of Object.keys(components.languages)) {
        const { alias } = components.languages[name]
        const match = Array.isArray(alias)
          ? alias.includes(language)
          : alias === language
        if (match) {
          language = name
        }
      }
    }

    if (!components.languages[language]) {
      return
    }

    // Load dependencies first
    if (!withoutDependencies && components.languages[language].require) {
      loadLanguages(components.languages[language].require)
    }

    const pathToLanguage = 'prismjs/components/prism-' + language
    delete require.cache[require.resolve(pathToLanguage)]
    delete Prism.languages[language]
    require(pathToLanguage)

    // Reload dependents
    const dependents = getPeerDependents(language).filter(dependent => {
      // If dependent language was already loaded,
      // we want to reload it.
      if (Prism.languages[dependent]) {
        delete Prism.languages[dependent]
        return true
      }
      return false
    })
    if (dependents.length > 0) {
      loadLanguages(dependents, true)
    }
  })
}

module.exports = function(arr) {
  // Don't expose withoutDependencies
  loadLanguages(arr)
}
