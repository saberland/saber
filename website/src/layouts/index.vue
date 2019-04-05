<template>
  <div class="layout">
    <Header />
    <div class="content">
      <main class="main">
      <slot name="default" />
    </main>
    </div>
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
