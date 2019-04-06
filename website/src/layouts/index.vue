<template>
  <div class="layout">
    <Header :showToggle="true"/>
    <Sidebar class="home-sidebar" :items="$themeConfig.sidebar"/>
    <div class="content">
      <main class="main">
      <slot name="default" />
    </main>
    </div>
  </div>
</template>

<script>
import Header from '../components/Header.vue'
import Sidebar from '../components/Sidebar.vue'

export default {
  props: ['page'],

  head() {
    return {
      title: this.page.attributes.title
    }
  },

  components: {
    Header,
    Sidebar
  }
}
</script>

<style scoped>
.home-sidebar {
  display: none;
  @media (max-width: 768px) {
    display: block;
  }
}
</style>
