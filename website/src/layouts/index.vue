<template>
  <div class="layout">
    <Header />
    <main class="container content">
      <slot name="default" />
    </main>
  </div>
</template>

<script>
import Header from '../components/Header.vue'

export default {
  props: ['page'],

  head() {
    return {
      title: this.page.attributes.title
    }
  },

  components: {
    Header
  }
}
</script>
