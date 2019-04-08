import client from 'webpack-hot-middleware/client'

export const init = ({ router }) => {
  client.subscribe(obj => {
    if (obj.action === 'router:push') {
      const handler = status => {
        if (status === 'idle') {
          module.hot.removeStatusHandler(handler)
          router.push(obj.path)
        }
      }
      module.hot.addStatusHandler(handler)
    }
  })
}
