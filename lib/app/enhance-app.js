import Vue from 'vue'
import Meta from 'vue-meta'
import ClientOnly from './ClientOnly'

Vue.use(Meta, {
  keyName: 'head',
  attribute: 'data-saber',
  ssrAttribute: 'data-saberssr'
})

Vue.component(ClientOnly.name, ClientOnly)
