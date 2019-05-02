import createApp from './create-app'

const { app, router } = createApp()

if (process.env.NODE_ENV === 'development') {
  require('./dev-client').init({ router })
}

router.onReady(() => {
  app.$mount('#_saber')
})
