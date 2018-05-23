import _app from '#out/templates/app'

const { app, router } = _app

router.onReady(() => {
  app.$mount('#__saber')
})
