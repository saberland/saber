/* eslint-disable */
import event from '#app/event'

if (
  process.browser &&
  process.env.NODE_ENV === 'production' &&
  __PWA_ENABLED__ &&
  window.location.protocol === 'https:'
) {
  const { register } = require('register-service-worker')

  register(`${__PUBLIC_PATH__}sw.js`, {
    ready() {
      console.log('[saber:pwa] Service worker is active.')
      event.$emit('service-worker', 'ready')
    },
    cached() {
      console.log('[saber:pwa] Content has been cached for offline use.')
      event.$emit('service-worker', 'cached')
    },
    updated() {
      console.log('[saber:pwa] Content updated.')
      event.$emit('service-worker', 'updated')
    },
    offline() {
      console.log(
        '[saber:pwa] No internet connection found. App is running in offline mode.'
      )
      event.$emit('service-worker', 'offline')
    },
    error(err) {
      console.error(
        '[saber:pwa] Error during service worker registration:',
        err
      )
      event.$emit('service-worker', 'error', err)
      if (__GA_ID__) {
        ga('send', 'exception', {
          exDescription: err.message,
          exFatal: false
        })
      }
    }
  })
}
