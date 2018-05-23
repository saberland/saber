import Vue from 'vue'
import Router from 'vue-router'
import routes from '#out/templates/routes'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes
})
