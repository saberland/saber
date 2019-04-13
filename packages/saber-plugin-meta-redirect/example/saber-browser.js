export default ({ createRedirect }) => {
  createRedirect({
    fromPath: '/redirect-to-about',
    toPath: '/about.html'
  })
}
