import createApp from '#out/templates/app'

const { app, router } = createApp()

router.onReady(() => {
  app.$mount('#__saber')
})
