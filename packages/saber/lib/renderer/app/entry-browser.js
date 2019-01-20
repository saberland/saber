import createApp from './create-app'

const { app, router } = createApp()

router.onReady(() => {
  app.$mount('#_saber')
})
