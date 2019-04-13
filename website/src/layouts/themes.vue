<template>
  <div class="layout">
    <Header :showToggle="true"/>
    <Sidebar class="home-sidebar" :items="$themeConfig.sidebar"/>
    <div class="content-fluid">
      <slot name="default"/>
    </div>
  </div>
</template>

<script>
import Header from '../components/Header.vue'
import Sidebar from '../components/Sidebar.vue'

export default {
  props: ['page'],

  head() {
    const { title } = this.page.attributes
    return {
      title: title
        ? `${title} - ${this.$siteConfig.title}`
        : this.$siteConfig.title
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
