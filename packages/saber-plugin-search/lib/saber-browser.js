/* eslint-env browser */
/* globals __PUBLIC_URL__ */

export default ({ Vue }) => {
  Vue.prototype.$fetchSearchDatabase = function() {
    const locale = this.$localePath.slice(1) || 'default'
    return window
      .fetch(`${__PUBLIC_URL__}_saber/plugin-search/${locale}.json`)
      .then(res => res.json())
  }
}
