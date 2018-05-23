/* eslint-disable */
// Google analytics integration
export default function (ctx) {
  var router = ctx.router
  if (process.browser && process.env.NODE_ENV === 'production' && __GA_ID__) {
    (function (i, s, o, g, r, a, m) {
      i.GoogleAnalyticsObject = r
      i[r] = i[r] || function () {
        (i[r].q = i[r].q || []).push(arguments)
      }
      i[r].l = Number(new Date())
      a = s.createElement(o)
      m = s.getElementsByTagName(o)[0]
      a.async = 1
      a.src = g
      m.parentNode.insertBefore(a, m)
    })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga')

    ga('create', __GA_ID__, 'auto')
    ga('send', 'pageview')

    router.afterEach(function (to) {
      ga('set', 'page', to.fullPath)
      ga('send', 'pageview')
    })
  }
}
