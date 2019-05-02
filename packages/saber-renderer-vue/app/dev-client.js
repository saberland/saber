import client from 'webpack-hot-middleware/client'

export const init = ({ router }) => {
  client.subscribe(obj => {
    if (obj.action === 'router:push') {
      if (obj.error) {
        console.error(`You need to refresh the page when the error is fixed!`)
      }
      if (module.hot.status() === 'idle') {
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
