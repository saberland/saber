export default ({ router }) => {
  const dumbComponent = text => ({
    render: h => h('h1', null, [text])
  })
  router.addRoutes([
    {
      path: '/hehe',
      component: dumbComponent('hehe'),
      children: [
        {
          path: 'hmm',
          component: dumbComponent('hmm')
        },
        {
          path: 'well',
          component: dumbComponent('well'),
          children: [
            {
              path: 'deep',
              component: dumbComponent('deep')
            }
          ]
        }
      ]
    }
  ])
}
