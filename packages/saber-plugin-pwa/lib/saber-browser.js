/* eslint-disable */

export default context => {
  if (process.browser && 'serviceWorker' in navigator) {
    const { notifyUpdates } = __PWA_OPTIONS__
    const { Workbox } = require('workbox-window')

    if (notifyUpdates) {
      const workbox = (context.workbox = new Workbox(
        `${__PUBLIC_URL__}service-worker.js`
      ))

      const toast = require('native-toast')
      require('native-toast/dist/native-toast.css')

      const showUpdateNotifier = () => {
        const button = document.createElement('span')
        button.textContent = 'click to apply'
        Object.assign(button.style, {
          color: 'pink',
          cursor: 'pointer'
        })
        button.addEventListener('click', () => {
          button.textContent = 'updating..'
          button.disabled = true

          workbox.addEventListener('controlling', event => {
            window.location.reload()
          })

          workbox.messageSW({ type: 'SKIP_WAITING' })
        })
        toast({
          message: 'A new version of this app is available',
          position: 'south-east',
          timeout: 20000, // 20 seconds
          elements: [button]
        })
      }

      workbox.addEventListener('installed', event => {
        if (!event.isUpdate) {
          toast({
            message: 'Ready for offline use',
            position: 'south-east',
            timeout: 5000 // 5 seconds
          })
        }
      })

      workbox.addEventListener('waiting', () => {
        showUpdateNotifier()
      })
    }

    workbox.register()
  }
}
