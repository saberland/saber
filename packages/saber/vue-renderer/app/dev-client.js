import client from 'webpack-hot-middleware/client'

export const init = ({ router }) => {
  client.subscribe(obj => {
    if (obj.action === 'router:push') {
      router.push(obj.path)
    }
  })
}
