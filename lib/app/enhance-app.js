import Vue from 'vue'
import Meta from 'vue-meta'

Vue.use(Meta, {
  keyName: 'head',
  attribute: 'data-saber',
  ssrAttribute: 'data-saberssr'
})
