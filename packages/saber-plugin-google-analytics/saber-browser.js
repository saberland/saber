/* eslint-disable */
// Google analytics integration for Vue.js renderer
export default function (ctx) {
  var router = ctx.router
  if (process.browser && process.env.NODE_ENV === 'production' && __GA_TRACK_ID__) {

    switch (__GA_TRACK_TYPE__) {
      case 'ga-lite':
        (function (e, t, n, i, s, a, c) {
          e[n] = e[n] || function () {
            (e[n].q = e[n].q || []).push(arguments)
          }
          a = t.createElement(i)
          c = t.getElementsByTagName(i)[0]
          a.async = true
          a.src = s
          c.parentNode.insertBefore(a,c)
        })(window, document, 'galite', 'script', 'https://cdn.jsdelivr.net/npm/ga-lite@2.0.1/dist/ga-lite.min.js')

        galite('create', __GA_TRACK_ID__, 'auto')
        galite('send', 'pageview')

        router.afterEach(function (to) {
          galite('set', 'page', to.fullPath)
          galite('send', 'pageview')
        })
        break
      default:
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

        ga('create', __GA_TRACK_ID__, 'auto')
        ga('send', 'pageview')

        router.afterEach(function (to) {
          ga('set', 'page', to.fullPath)
          ga('send', 'pageview')
        })
        break
    }
  }
}
