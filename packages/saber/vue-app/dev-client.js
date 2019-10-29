import client from 'webpack-hot-middleware/client'

export const init = ({ router }) => {
  window.__SABER_DEV_CLIENT_ID__ = Math.random()
    .toString(36)
    .substring(7)

  client.subscribe(obj => {
    if (obj.action === 'router:push' && obj.id === __SABER_DEV_CLIENT_ID__) {
      if (obj.hasError) {
        console.error(`You need to refresh the page when the error is fixed!`)
      }

      if (obj.alreadyBuilt) {
        router.push(obj.route)
      } else {
        const handler = status => {
          if (status === 'idle') {
            module.hot.removeStatusHandler(handler)
            router.push(obj.route)
          }
        }

        module.hot.addStatusHandler(handler)
      }
    }
  })
}
