/* eslint-disable */

export default context => {
  if (process.browser && 'serviceWorker' in navigator) {
    const { notifyUpdates } = __PWA_OPTIONS__
    const { Workbox } = require('workbox-window')

    context.rootOptions.mixins.push({
      mounted() {
        const workbox = (context.workbox = new Workbox(
          `${__PUBLIC_URL__}service-worker.js`
        ))

        let snackbar
        const {
          pwaFirstTimeInstallMessage = 'Ready for offline use',
          pwaUpdateFoundMessage = 'Downloading app updates in the background',
          pwaUpdateReadyMessage = 'A new version of this app is available',
          pwaUpdateButtonMessage = 'UPDATE',
          pwaDismissMessage = 'DISMISS'
        } = this.$siteConfig

        if (notifyUpdates) {
          snackbar = require('@snackbar/core')
          require('@snackbar/core/dist/snackbar.css')

          const showUpdateNotifier = () => {
            snackbar.createSnackbar(pwaUpdateReadyMessage, {
              position: 'right',
              timeout: 20000,
              actions: [
                {
                  text: pwaUpdateButtonMessage,
                  style: {
                    color: 'pink'
                  },
                  callback(button) {
                    button.innerHTML = `<svg width="20" height="20" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" stroke="#fff"><g transform="translate(1 1)" stroke-width="2" fill="none" fill-rule="evenodd"><circle stroke-opacity=".5" cx="18" cy="18" r="18"/><path d="M2.433 27.037c4.99 8.597 16.008 11.52 24.604 6.53"><animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="1s" repeatCount="indefinite"/></path></g></svg>`
                    button.disabled = true

                    workbox.addEventListener('controlling', event => {
                      window.location.reload()
                    })

                    workbox.messageSW({ type: 'SKIP_WAITING' })
                  }
                }
              ]
            })
          }

          workbox.addEventListener('installed', event => {
            if (!event.isUpdate) {
              snackbar.createSnackbar(pwaFirstTimeInstallMessage, {
                position: 'right',
                timeout: 5000,
                actions: [
                  {
                    text: pwaDismissMessage
                  }
                ]
              })
            }
          })

          workbox.addEventListener('waiting', () => {
            showUpdateNotifier()
          })
        }

        const hasInstalledWorker = Boolean(navigator.serviceWorker.controller)

        workbox.register().then(reg => {
          if (notifyUpdates) {
            reg.addEventListener('updatefound', () => {
              // `updatefound` is fired on first install too
              if (hasInstalledWorker) {
                snackbar.createSnackbar(pwaUpdateFoundMessage, {
                  position: 'right',
                  timeout: 3000,
                  actions: [
                    {
                      text: pwaDismissMessage
                    }
                  ]
                })
              }
            })
          }
        })
      }
    })
  }
}
